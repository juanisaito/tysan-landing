// Service Worker para TYSAN Landing Page - Versión simplificada
const CACHE_NAME = 'tysan-cache-v4'; // Incrementar versión
const STATIC_CACHE = 'tysan-static-v4';
const DYNAMIC_CACHE = 'tysan-dynamic-v4';

// Archivos que siempre deben estar en caché
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/videos/tysan-background.webm',
  '/videos/tysan-background.mp4',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('🔄 Service Worker instalando...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('✅ Cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.error('❌ Error cacheando recursos:', error);
      })
  );
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🔄 Service Worker activando...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('🗑️ Eliminando cache viejo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Tomar control inmediatamente
  self.clients.claim();
});

// Fetch event - estrategia simple
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests no-GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia simple: network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cachear respuestas exitosas
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback a cache si no hay red
        return caches.match(request);
      })
  );
});

// Mensaje para limpiar cache manualmente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('🗑️ Limpiando cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
    );
  }
}); 