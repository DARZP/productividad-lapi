const CACHE_VERSION = 'lapi-pwa-v3.0.0'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './sucursal.html',
    './admin.html',
    './auditoria.html',
    './reportes.html', 
    './config.js'
];

// 1. Instalar y forzar espera
self.addEventListener('install', event => {
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_VERSION)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

// 2. Activar y destruir basura vieja
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                 
                    if (key !== CACHE_VERSION) {
                        console.log('[PWA] Borrando caché antiguo:', key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim(); // Toma el control de todas las pestañas abiertas
});


self.addEventListener('fetch', event => {
    // Solo interceptar peticiones "GET" (Ignorar POST a Firebase, etc.)
    if (event.request.method !== 'GET') return;

  
    if (!event.request.url.startsWith('http')) {
        return;
    }

   
    if (event.request.url.includes('firestore.googleapis.com') || 
        event.request.url.includes('identitytoolkit') ||
        event.request.url.includes('firebase')) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then(response => {
               
                const resClone = response.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => {
                
                return caches.match(event.request);
            })
    );
});
