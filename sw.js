// Bloom Service Worker
// Offline-first caching for PWA

const CACHE_NAME = 'bloom-v2';
const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Install: pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use addAll with catch so missing icons don't block install
      return Promise.all(
        CORE_ASSETS.map((url) =>
          cache.add(url).catch((err) => console.warn('[SW] Skip cache:', url, err))
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first for same-origin, network fallback
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Network-first for Google Fonts (stylesheets can change)
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(
      fetch(req).then((res) => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Cache-first for font files (immutable)
  if (url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          return res;
        });
      })
    );
    return;
  }

  // Cache-first for same-origin app shell
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        return cached || fetch(req).then((res) => {
          // Cache successful same-origin responses
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
          }
          return res;
        }).catch(() => {
          // Fallback to index.html for navigation requests (SPA routing)
          if (req.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
    );
  }
});
