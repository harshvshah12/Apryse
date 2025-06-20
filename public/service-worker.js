const CACHE_NAME = "webviewer-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/webviewer/lib/core/CoreControls.js",
  "/webviewer/lib/webviewer.min.js",
  "/files/PDFTRON_about.pdf",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
}); 

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
