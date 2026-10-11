const {onDocumentCreated}=require('firebase-functions/v2/firestore');
const admin=require('firebase-admin');
admin.initializeApp();

const KIND={homework:'New homework',test:'New test',important:'Important',announcement:'New announcement'};

async function push(x){
  const db=admin.firestore();
  const snap=await db.collection('tokens').get();
  const tokens=snap.docs.map(d=>d.id);
  if(!tokens.length)return;
  const title=(KIND[x.type]||'New post')+': '+(x.title||x.text||'');
  const body=x.body?String(x.body).slice(0,120):(x.subject||x.due||'');
  for(let i=0;i<tokens.length;i+=500){
    const batch=tokens.slice(i,i+500);
    const res=await admin.messaging().sendEachForMulticast({tokens:batch,notification:{title,body}});
    const dead=[];
    res.responses.forEach((r,j)=>{
      const c=r.error&&r.error.code;
      if(c==='messaging/registration-token-not-registered'||c==='messaging/invalid-registration-token')dead.push(batch[j]);
    });
    await Promise.all(dead.map(t=>db.collection('tokens').doc(t).delete()));
  }
}

exports.notifyAnn=onDocumentCreated('ann/{id}',e=>push(e.data.data()));
exports.notifyImp=onDocumentCreated('imp/{id}',e=>push({...e.data.data(),type:'important'}));
