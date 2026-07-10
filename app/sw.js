const CACHE_NAME = "elitepixels-v1";
const ARCHIVOS_CACHE = [
  "./index.html",
  "https://cdn.jsdelivr.net/npm/tailwindcss@3.3.0/dist/tailwind.min.css",
  "https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css",
  "https://cdn.jsdelivr.net/gh/dmxyt/elitepixels.store@741c24092788343c5b9f92dbecae9d3ae93ae837/file_00000000e7bc71f5844bdf8247e54e5c.png"
];

// Instalar: guardar archivos en caché
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ARCHIVOS_CACHE))
    .then(() => self.skipWaiting())
  );
});

// Activar: limpiar cachés viejas
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(nombres => {
      return Promise.all(
        nombres.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))
      );
    }).then(() => self.clients.claim())
  );
});

// Cargar: usar caché primero, luego red
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(respuesta => {
      return respuesta || fetch(e.request).then(respuestaRed => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(e.request, respuestaRed.clone());
          return respuestaRed;
        });
      });
    })
  );
});
