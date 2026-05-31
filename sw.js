// sw.js - Service Worker de LAPI (Versión Activa / Network First)

// 🛑 CAMBIA ESTE NÚMERO CADA VEZ QUE SUBAS UNA ACTUALIZACIÓN A NETLIFY
const CACHE_VERSION = 'lapi-pwa-v1.1.0'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './sucursal.html',
    './admin.html',
    './auditoria.html',
    './config.js'
];

// 1. Instalar y forzar espera
self.addEventListener('install', event => {
    self.skipWaiting(); // Fuerza a este nuevo Service Worker a tomar el control inmediatamente
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
                    // Si el nombre del caché no coincide con la versión actual, lo borra
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

// 3. Estrategia "Network First" (Primero buscar en internet, si falla, usar Caché)
self.addEventListener('fetch', event => {
    // Solo interceptar peticiones "GET" (Ignorar POST a Firebase, etc.)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Si hay internet y responde bien, clonamos la respuesta y la guardamos en el caché fresco
                const resClone = response.clone();
                caches.open(CACHE_VERSION).then(cache => cache.put(event.request, resClone));
                return response;
            })
            .catch(() => {
                // Si falla el fetch (ej. no hay internet), devolvemos lo que tengamos en caché
                return caches.match(event.request);
            })
    );
});
