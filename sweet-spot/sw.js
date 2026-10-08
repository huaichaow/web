// Offline support. The page is network-first (so a new build shows up on the next
// load); everything else (hashed build assets, portraits, the MediaPipe wasm and
// models from their CDNs) is cache-first, since those never change under a URL.
const CACHE = 'scratch-v2';
const PRECACHE = ['./', 'manifest.webmanifest', 'dario.jpg', 'sam.jpg', 'elon.jpg', 'icon-192.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const put = (req, res) => {
  if (res.ok || res.type === 'opaque') {
    const copy = res.clone(); // now, before the page reads the body
    caches.open(CACHE).then((c) => c.put(req, copy));
  }
  return res;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => put('./', res)).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => put(req, res))));
});
