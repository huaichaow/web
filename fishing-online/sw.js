// Service worker template. vite.config.ts fills in the version and precache list at build
// time and emits the result as sw.js. All URLs are relative to this script's location.
const VERSION = 'f520eadb8955';
const PRECACHE = [
  "./",
  "index.html",
  "assets/index-Cy46iP68.js",
  "assets/index-DAKeMySv.css",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "manifest.webmanifest"
];
const PREFIX = 'fishing-online-';
const CACHE = PREFIX + VERSION;
// Module scripts and stylesheets are requested with an Origin header (crossorigin), which
// would miss entries precached without one if the server sends `Vary: Origin`.
const MATCH = { ignoreVary: true };

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
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (req.mode === 'navigate') {
    // Network first so a new version shows up when online; the cached app shell when offline
    event.respondWith(
      fetch(req).catch(() =>
        caches.open(CACHE).then((cache) => cache.match('./', MATCH).then((hit) => hit || cache.match('index.html', MATCH))),
      ),
    );
    return;
  }

  // Build assets have hashed names, so cache first is safe
  event.respondWith(caches.match(req, MATCH).then((hit) => hit || fetch(req)));
});
