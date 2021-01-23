const staticCacheName = 'site-static'
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css',
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2'
]

//Install event
self.addEventListener('install', event =>{
    event.waitUntil(
        caches.open(staticCacheName).then(cache =>{
            cache.addAll(assets)
            console.log('caching shell assets')
        })
    )
})

// Activate event
self.addEventListener('activate', event =>{
    
})

// Fetch event
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cacheResponse => cacheResponse || fetch(event.request))
    )
})

