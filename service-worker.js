const CACHE_NAME = 'shakzz-tv-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/cutie.js',
    '/channels.js',
    '/assets/Jinwoo.png',
    '/assets/SungJinwoo.jpeg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap'
];

// Only these hosts are ever handled by the service worker.
// Everything else (Amagi, Converge proxy, workers.dev, JW Player CDN...) goes straight to the browser.
const CACHEABLE_HOSTS = [
    self.location.hostname,
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
    'fonts.gstatic.com'
];

// 1. Install: cache the basic UI files
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate: clean up old caches
self.addEventListener('activate', (event) => {
    console.log('SW v4 active');
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) =>
                Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                )
            )
        ])
    );
});

// 3. Fetch: one single handler
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Never touch non-GET requests
    if (req.method !== 'GET') return;

    const reqUrl = new URL(req.url);

    // Ignore anything that isn't your site or the font/icon CDNs
    if (!CACHEABLE_HOSTS.includes(reqUrl.hostname)) return;

    const path = reqUrl.pathname;

    // RULE 1: Don't intercept streams, APIs or JW Player. Let the browser handle them.
    const isDynamic =
        path.endsWith('.m3u8') ||
        path.endsWith('.ts') ||
        path.endsWith('.mpd') ||
        path.endsWith('.m4s') ||
        path.includes('jwplayer') ||
        path.startsWith('/api/');
    if (isDynamic) return;

    // RULE 2: Network-first for HTML, CSS and JS (always get the latest code)
    if (
        path === '/' ||
        path.endsWith('.html') ||
        path.endsWith('.css') ||
        path.endsWith('.js')
    ) {
        event.respondWith(
            fetch(req).catch(() => caches.match(req))
        );
        return;
    }

    // RULE 3: Cache-first for static images and fonts
    event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req))
    );
});
