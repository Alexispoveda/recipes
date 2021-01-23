if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
        .then(registration=>console.log('SW registered', registration))
        .catch(err=>console.error('SW not registered', err))
} 