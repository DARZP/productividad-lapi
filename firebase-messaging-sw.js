importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyDW-KIxM3m5QXnfzpOUmwhuLILLAk6u5rA",
    authDomain: "lapi-productividad.firebaseapp.com",
    projectId: "lapi-productividad",
    storageBucket: "lapi-productividad.firebasestorage.app",
    messagingSenderId: "1077149571149",
    appId: "1:1077149571149:web:e1423dde4a8de6f8562404"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Esto controla qué pasa cuando llega una notificación y tienes la pestaña minimizada o en otra cosa
messaging.onBackgroundMessage(function(payload) {
    console.log('[firebase-messaging-sw.js] Notificación recibida: ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png' // Ícono genérico de notificación, puedes cambiar la URL por tu logo
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
