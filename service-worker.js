const CACHE_NAME = 'shakzz-tv-v3'; 
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

// 1. Install Event: Cache the basic UI files
self.addEventListener('install', (event) => {
    // Skip waiting forces the new service worker to activate immediately
    self.skipWaiting(); 
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
    // Claim clients ensures the service worker controls all open tabs immediately
    event.waitUntil(self.clients.claim()); 
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// 3. Fetch Event: Smart Caching
self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // RULE 1: Bypass cache completely for streams and APIs
    const isDynamic = url.includes('.m3u8') || 
                      url.includes('.ts') || 
                      url.includes('jwplayer') ||
                      url.includes('/api/') ||
                      url.includes('workers.dev');

    if (isDynamic) {
        event.respondWith(fetch(event.request));
        return;
    }

    // RULE 2: Network-First for HTML, CSS, and JS (Always get the latest code)
    if (url.includes('.html') || url.includes('.css') || url.includes('.js') || url === location.origin + '/') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match(event.request))
        );
        return;
    }

    // RULE 3: Cache-First for static images and fonts (Saves bandwidth)
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});