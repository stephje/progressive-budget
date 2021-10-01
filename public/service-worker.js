const CACHE_NAME = "progressive-budget-v1";
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    // '/manifest.webmanifest',
    '/styles.css',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
    console.log('[Service Worker] Install');

    event.waitUntil((async () => {
        const cache = await caches.open(CACHE_NAME);
        console.log('[Service Worker] Caching all: app shell and content');
        await cache.addAll(FILES_TO_CACHE);
      })());

  });