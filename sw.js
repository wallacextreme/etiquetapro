const CACHE_NAME = 'etiquetapro-v1.0.1';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './Etiquetas A4.html',
  './manifest.json',
  './offline.html',
  './favicon.ico',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/favicon.png'
];

// Instalação do Service Worker e pré-cache dos recursos vitais
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Interceptação de requisições de rede (Offline-First / Stale-While-Revalidate)
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Apenas intercepta métodos GET
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Não interceptar esquemas não-HTTP (ex: data:, chrome-extension:)
  if (!url.protocol.startsWith('http')) return;

  // Requisições de navegação de páginas (HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Tenta rede primeiro para navegação mais atualizada, mas com fallback rápido ao cache
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return networkResponse;
          })
          .catch(() => {
            // Em caso de falha na rede, retorna cache ou página offline
            return cachedResponse || caches.match('./index.html') || caches.match('./offline.html');
          });

        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Requisições de recursos estáticos e assets da mesma origem ou fontes
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza o cache em segundo plano (Stale-While-Revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Silencioso em offline
          });
        return cachedResponse;
      }

      // Se não está em cache, busca na rede e armazena
      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // Falha de rede para imagem ou outro asset
          if (request.destination === 'image') {
            return caches.match('./icons/icon-192.png');
          }
          return new Response('Recurso indisponível offline', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});
