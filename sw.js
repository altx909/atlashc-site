const CACHE_NAME = 'atlashc-v1';
const CACHED_URLS = [
  '/',
  '/services',
  '/about',
  '/blog',
  '/furnace-repair-saskatoon',
  '/furnace-installation-saskatoon',
  '/ac-repair-saskatoon',
  '/ac-installation-saskatoon',
  '/water-heater-repair-saskatoon',
  '/water-heater-installation-saskatoon',
  '/plumbing-repair-saskatoon',
  '/emergency-plumbing-saskatoon',
  '/public/images/logo/atlashc-logo.svg',
  '/favicon.ico'
];

// Install — cache key pages
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(CACHED_URLS))
  );
  self.skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, fall back to cache
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
