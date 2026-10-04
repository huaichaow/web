// Service worker template. The `pwa` plugin in vite.config.ts fills in the
// placeholders at build time and emits it as dist/sw.js; it is not used in dev.
const PRECACHE = ["./","assets/index-BvHTguPY.js","assets/index-Bh6jC9rC.css","manifest.webmanifest","icons/apple-touch-icon.png","icons/icon-192.png","icons/icon-512.png","icons/maskable-512.png"];
const CACHE = `cs-web-${"c30b3794e26d"}`;

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('cs-web-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;

  // Pages: network first so a new deploy shows up on the next launch, cache when offline.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(async () => (await caches.match(req, { ignoreSearch: true, ignoreVary: true })) || caches.match('./')),
    );
    return;
  }

  // Everything else is content-hashed or static: cache first. ignoreVary because module
  // scripts are requested with an Origin header the precache requests lacked.
  event.respondWith(
    caches.match(req, { ignoreVary: true }).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
