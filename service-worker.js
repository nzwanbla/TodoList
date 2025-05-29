const CACHE_NAME = "todolist-cache-v2";
const urlsToCache = [
    "./",
    "./index.html",
    "./CSS/main.css",
    "./JS/main.js",
    "./JS/time.js",
    "./assets/favicon.png",
    "./offline.html"
];

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting(); // tambahkan ini
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            )
        )
    );
    self.clients.claim(); // tambahkan ini juga
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => response)
      .catch(() => {
        if (event.request.headers.get("accept")?.includes("text/html")) {
          return caches.match("./offline.html");
        }
        return caches.match(event.request);
      })
  );
});
