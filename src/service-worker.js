const CACHE_NAME = 'calendly-fastload-v1';
const urlsToCache = [
  'https://your-cdn.com/modified-widget.min.js', // or official 'https://assets.calendly.com/assets/external/widget.js'
  'https://assets.calendly.com/assets/external/widget.css',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
