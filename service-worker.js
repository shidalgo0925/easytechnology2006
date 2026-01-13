// Service Worker para EasyTech Services
// Versión: 1.0.0
const CACHE_NAME = 'easytech-v1.0.0';
const RUNTIME_CACHE = 'easytech-runtime-v1';

// Archivos estáticos para cachear
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/contacto.html',
  '/servicios.html',
  '/nosotros.html',
  '/portafolio.html',
  '/assets/images/logo.png',
  '/manifest.json'
];

// Estrategia: Cache First para recursos estáticos
const CACHE_FIRST_PATTERNS = [
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/,
  /\.(?:woff|woff2|ttf|eot)$/
];

// Estrategia: Network First para HTML
const NETWORK_FIRST_PATTERNS = [
  /\.html$/,
  /^\/$/
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, { cache: 'reload' })));
      })
      .catch(() => {
        // Silently fail in production
      })
  );
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
        caches.keys().then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => {
              if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                return caches.delete(cacheName);
              }
            })
          );
        })
  );
  return self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones a otros orígenes (CDNs, APIs externas)
  if (url.origin !== location.origin) {
    // Para recursos de CDN, usar network first
    if (request.destination === 'script' || request.destination === 'style' || request.destination === 'image') {
      event.respondWith(networkFirst(request));
    }
    return;
  }

  // Estrategia según tipo de recurso
  if (CACHE_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(cacheFirst(request));
  } else if (NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

// Estrategia Cache First
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    // Si es una imagen, retornar una imagen placeholder
    if (request.destination === 'image') {
      return new Response('', { status: 404 });
    }
    throw error;
  }
}

// Estrategia Network First
async function networkFirst(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    
    // Si es HTML y no hay cache, retornar página offline
    if (request.destination === 'document') {
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Sin Conexión - EasyTech Services</title>
          <style>
            body {
              font-family: 'Inter', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .offline-container {
              max-width: 500px;
            }
            h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            p { font-size: 1.2rem; opacity: 0.9; margin-bottom: 2rem; }
            .btn {
              display: inline-block;
              padding: 12px 24px;
              background: #fbbf24;
              color: #1f2937;
              text-decoration: none;
              border-radius: 8px;
              font-weight: 600;
              margin: 0 10px;
            }
          </style>
        </head>
        <body>
          <div class="offline-container">
            <h1>📡 Sin Conexión</h1>
            <p>No tienes conexión a internet. Algunas funciones pueden no estar disponibles.</p>
            <a href="/" class="btn">Volver al Inicio</a>
            <button onclick="window.location.reload()" class="btn">Reintentar</button>
          </div>
        </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html' },
          status: 200
        }
      );
    }
    
    throw new Error('Network error');
  }
}

// Mensajes del Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(event.data.urls);
      })
    );
  }
});

// Sincronización en segundo plano
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  // Sincronizar formularios pendientes cuando haya conexión
}

