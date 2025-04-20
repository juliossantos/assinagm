const CACHE_NAME = 'pwa-assinatura-cache-v1';
const FILES_TO_CACHE = [
    'index.html',
    'nf.html',
    'boleto.html',
    'manifest.json',
    'icon-192.png'
];

// Instalação e cache dos arquivos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

// Interceptação de requisições para funcionar offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(() => caches.match('index.html'))
    );
});

// Atualização do cache quando necessário
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cache => cache !== CACHE_NAME)
                .map(cache => caches.delete(cache))
            );
        })
    );
    self.clients.claim();
});
