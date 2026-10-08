// Service worker template. vite.config.js fills in the version and file list at build time.
const CACHE = 'sky-scarf-763597c78f69';
const PRECACHE = ["./","assets/index-C_JXBSMm.js","assets/index-DsjqxyqX.css","icons/icon-180.png","icons/icon-192.png","icons/icon-512.png","manifest.webmanifest"];
const FONT_CACHE = 'sky-scarf-fonts';

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== FONT_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  // Google Fonts: serve from cache, refresh in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(caches.open(FONT_CACHE).then(async (cache) => {
      const cached = await cache.match(request);
      const fresh = fetch(request).then((res) => {
        if (res.ok || res.type === 'opaque') cache.put(request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fresh;
    }));
    return;
  }

  if (url.origin !== self.location.origin) return;

  // Pages: network first so updates show up, cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match('./', { ignoreSearch: true, ignoreVary: true })));
    return;
  }

  // Built assets have hashed names, so cache first is safe. ignoreVary: the crossorigin
  // script/style requests carry an Origin header that a precached `Vary: Origin` entry won't match.
  event.respondWith(caches.match(request, { ignoreSearch: true, ignoreVary: true }).then((hit) => hit || fetch(request)));
});
