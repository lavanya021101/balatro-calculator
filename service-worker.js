const CACHE_NAME = 'balatro-calculator-offline-v1';

const OFFLINE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './main.js',
  './cards.js',
  './breakdown.js',
  './manageWorkers.js',
  './balatro-sim.js',
  './worker.js',
  './hoverCard.js',
  './hand-url.js',
  './structured-data.jsonld',
  './manifest.json',
  './assets/8BitDeck.png',
  './assets/8BitDeck_opt2.png',
  './assets/Balatro logo-new.png',
  './assets/Discord-Logo-Color.svg',
  './assets/Editions.png',
  './assets/Enhancers.png',
  './assets/Jokers.png',
  './assets/chips.png',
  './assets/ui_assets.png',
  './assets/m6x11plus.ttf'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    )
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const requestURL = new URL(request.url);
  if (requestURL.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') return response;
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, cloned));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
