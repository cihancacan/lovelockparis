// Service Worker pour PWA
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('lovelockparis-2026').then(cache => {
      return cache.addAll([
        '/',
        '/manifest-2026.json',
        '/icon-192x192.png',
        '/icon-512x512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});