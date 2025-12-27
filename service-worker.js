const CACHE_NAME = 'shakzz-tv-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/cutie.js',
    '/channels.js',
    '/Jinwoo.png',
    '/SungJinwoo.jpeg',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap'
];

// 1. Install Event: Cache the basic UI files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activate Event: Clean up old caches if you update the version
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    const url = event.request.url;

    // 1. ALWAYS Bypass cache for Streams and the Upstash API
    const isDynamic = url.includes('.m3u8') || 
                      url.includes('.ts') || 
                      url.includes('jwplayer') ||
                      url.includes('/api/'); // <--- ADD THIS LINE

    if (isDynamic) {
        // Network Only strategy for dynamic/real-time data
        event.respondWith(fetch(event.request));
    } else {
        // Cache-First strategy for static assets (UI, CSS, Images)
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    return response || fetch(event.request);
                })
        );
    }
});
