/* Blockwright service worker (template; vite.config.ts fills in the version and precache list).
 *
 * - App shell (built JS/CSS/WASM, icons, manifest, index.html) is precached on install.
 * - Navigations: network first, falling back to the cached index.html when offline.
 * - Other same-origin GETs inside the scope: cache first, then network (and cached for next time).
 * - Cross-origin requests (map tiles, Overpass, elevation tiles, multiplayer) are not touched.
 * - A new version waits until every tab is closed, so a running game never mixes versions.
 */
const VERSION = "b71cd7f7943d";
const PRECACHE = [
  "./",
  "./assets/genWorker-Cd9lZPYf.js",
  "./assets/index-DN7T9ATX.js",
  "./assets/index-DYorKlg5.css",
  "./assets/mapcore_wasm_bg-1NqrZY24.wasm",
  "./assets/meshWorker-CfGoqQNp.js",
  "./favicon.svg",
  "./icons/apple-touch-icon.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./manifest.webmanifest",
  "./qr/bilibili-qr.png",
  "./qr/douyin-qr.png",
  "./qr/kuaishou-qr.jpg",
  "./qr/wechat-channels-qr.jpg",
  "./qr/xiaohongshu-qr.jpg"
];
const CACHE_PREFIX = 'blockwright-';
const CACHE = `${CACHE_PREFIX}${VERSION}`;
const SCOPE = self.registration.scope;
const INDEX_URL = new URL('./', SCOPE).href;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE.map((p) => new Request(new URL(p, SCOPE), { cache: 'reload' })))));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || !req.url.startsWith(SCOPE)) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) (await caches.open(CACHE)).put(INDEX_URL, res.clone());
          return res;
        } catch (err) {
          const cached = await caches.match(INDEX_URL, { cacheName: CACHE });
          if (cached) return cached;
          throw err;
        }
      })(),
    );
    return;
  }

  event.respondWith(
    (async () => {
      const cached = await caches.match(req, { cacheName: CACHE });
      if (cached) return cached;
      const res = await fetch(req);
      if (res.ok && res.type === 'basic') (await caches.open(CACHE)).put(req, res.clone());
      return res;
    })(),
  );
});
