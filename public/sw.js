const staticCacheName = 'site-static-v2'
const dynamicCacheName = 'site-dynamic-v2'
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
    'https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
    '/pages/fallback.html'
]

// Cache size
const limitCacheSize = (name, size) =>{
    caches.open(name)
    .then(cache=> cache.keys()
        .then(keys =>{
            if(keys.length > size){
                cache.delete(keys[0]).then(limitCacheSize(name, size))
            }
        })
    )
}

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

    //Clear old caches
    event.waitUntil(
        caches.keys()
        .then(keys => 
            Promise.all(keys
                .filter(key=>key !== staticCacheName && key !== dynamicCacheName) 
                .map(key=>caches.delete(key))
            )
        )
    )
})

// Fetch event
self.addEventListener('fetch', event => {
    
    //Do not save google data in cache
    if(event.request.url.indexOf('firestore.googleapis.com') === -1){
        // Use static resources saved and save dynamic resources (cache)
        event.respondWith(
            caches.match(event.request)
            .then(cacheResponse => 
                cacheResponse 
                || fetch(event.request)
                .then(fetchResponse => caches.open(dynamicCacheName)
                    .then(cache=>{
                        cache.put(event.request.url, fetchResponse.clone())
                        limitCacheSize(dynamicCacheName, 15)
                        return fetchResponse
                    })
                )
            ).catch(()=> {
                if(event.request.url.indexOf('.html')){
                    return caches.match('/pages/fallback.html')
                }
            })
        )
    }

})

