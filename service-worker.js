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

// 3. Fetch Event: Serve from cache, but use Network for streams
self.addEventListener('fetch', (event) => {
    // Check if the request is for a video stream or an external API
    const isStream = event.request.url.includes('.m3u8') || 
                     event.request.url.includes('.ts') || 
                     event.request.url.includes('jwplayer');

    if (isStream) {
        // If it's a stream, go directly to the network (NEVER CACHE STREAMS)
        event.respondWith(fetch(event.request));
    } else {
        // For everything else (UI, CSS, Images), try the cache first
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cache if found, otherwise go to network
                    return response || fetch(event.request);
                })
        );
    }
});
