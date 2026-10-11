importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');
const firebaseConfig = {
  apiKey: "AIzaSyDvnHZ24ooL_HWy48l7voiZ3qG0Ge8E-70",
  authDomain: "project-tesla-2033f.firebaseapp.com",
  databaseURL: "https://project-tesla-2033f-default-rtdb.firebaseio.com",
  projectId: "project-tesla-2033f",
  storageBucket: "project-tesla-2033f.firebasestorage.app",
  messagingSenderId: "246823875291",
  appId: "1:246823875291:web:b874ea295925ec57b352fe",
  measurementId: "G-DDM89DZ9GK"
};
firebase.initializeApp(firebaseConfig);
const messaging=firebase.messaging();
// Push messages that carry a "notification" payload are shown by the browser automatically.
// This handles data-only messages too.
messaging.onBackgroundMessage(p=>{
  if(p.notification)return;
  const d=p.data||{};
  self.registration.showNotification(d.title||'Project Tesla',{body:d.body||'',icon:'icon-192.png',tag:d.tag});
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{
    for(const c of l){if('focus' in c)return c.focus()}
    return clients.openWindow('./index.html');
  }));
});
