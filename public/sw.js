// Service Worker para TYSAN Landing Page - Versión optimizada para usuarios nuevos
const CACHE_NAME = 'tysan-cache-v5'; // Incrementar versión para forzar actualización
const STATIC_CACHE = 'tysan-static-v5';
const DYNAMIC_CACHE = 'tysan-dynamic-v5';

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

// Fetch event - estrategia optimizada para usuarios nuevos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar requests no-GET
  if (request.method !== 'GET') {
    return;
  }

  // Estrategia optimizada: network first con cache inteligente
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cachear respuestas exitosas (solo para recursos importantes)
        if (response.status === 200 && (
          url.pathname.includes('.css') ||
          url.pathname.includes('.js') ||
          url.pathname.includes('.png') ||
          url.pathname.includes('.jpg') ||
          url.pathname.includes('.webp') ||
          url.pathname.includes('.mp4') ||
          url.pathname.includes('.webm') ||
          url.pathname === '/'
        )) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fallback a cache si no hay red
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Si no hay cache, devolver una respuesta básica
          if (url.pathname === '/') {
            return new Response('<!DOCTYPE html><html><head><title>TYSAN</title></head><body><h1>Cargando...</h1></body></html>', {
              headers: { 'Content-Type': 'text/html' }
            });
          }
        });
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