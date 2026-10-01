// Offline cache for PS Online. The build writes the list of files and a version below.
const VERSION = 'dab48ebac879';
const PRECACHE = ["assets/CameraRawDialog-DdlFpV3b.js","assets/ContentAwareFillDialog-CKpkV61M.js","assets/KeyboardShortcutsDialog-Bo939p7P.js","assets/LiquifyDialog-B5WtZB9Z.js","assets/VanishingPointDialog-BSfoJPng.js","assets/contentAware.worker-CCUqZT5J.js","assets/gif-D1hhzC5X.js","assets/index-Bm_SmZfU.js","assets/index-DSS-YZfY.css","assets/psd-DvJUfcQ3.js","assets/svg-DmAqmP7k.js","icon-maskable.svg","icon.svg","./","manifest.webmanifest"];
const CACHE = `ps-online-${VERSION}`;

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => c.addAll(PRECACHE.map((p) => new URL(p, self.registration.scope).href)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('ps-online-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Pages: the network first so an update shows, the cached app shell offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).catch(() => caches.match(new URL('./', self.registration.scope).href, { cacheName: CACHE })),
    );
    return;
  }
  // Hashed assets: the cache first, filling it from the network.
  e.respondWith(
    caches.match(req, { cacheName: CACHE }).then(
      (hit) =>
        hit ||
        fetch(req).then((res) => {
          if (res.ok) {
            const copy = res.clone();
            void caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }),
    ),
  );
});
