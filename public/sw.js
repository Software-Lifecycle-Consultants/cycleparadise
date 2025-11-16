// Service Worker for caching strategy
const CACHE_NAME = 'cycle-paradise-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const IMAGE_CACHE = 'images-v1';

// Files to cache immediately
const STATIC_ASSETS = [
  '/',
  '/packages',
  '/guides',
  '/about',
  '/contact',
  '/css/critical.css',
  '/js/main.js',
  '/images/logo.png',
  '/favicon.svg',
  '/site.webmanifest',
  '/offline.html'
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  '/api/packages',
  '/api/guides',
  '/api/search'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              return cacheName !== STATIC_CACHE && 
                     cacheName !== DYNAMIC_CACHE && 
                     cacheName !== IMAGE_CACHE;
            })
            .map(cacheName => caches.delete(cacheName))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Chrome extensions and other protocols
  if (!request.url.startsWith('http')) return;

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (isImageRequest(request)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
  } else if (isAPIRequest(request)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else if (isPageRequest(request)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache strategies
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Cache first failed:', error);
    return getOfflineResponse(request);
  }
}

async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network first failed, trying cache:', error);
    const cachedResponse = await caches.match(request);
    return cachedResponse || getOfflineResponse(request);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  const networkPromise = fetch(request)
    .then(networkResponse => {
      if (networkResponse.status === 200) {
        const cache = caches.open(cacheName);
        cache.then(c => c.put(request, networkResponse.clone()));
      }
      return networkResponse;
    })
    .catch(() => cachedResponse);

  return cachedResponse || networkPromise;
}

// Helper functions
function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(css|js|woff2?|ttf|eot|svg|ico)$/);
}

function isImageRequest(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(jpg|jpeg|png|gif|webp|avif)$/);
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         API_CACHE_PATTERNS.some(pattern => url.pathname.startsWith(pattern));
}

function isPageRequest(request) {
  const url = new URL(request.url);
  return request.headers.get('accept')?.includes('text/html');
}

async function getOfflineResponse(request) {
  if (isPageRequest(request)) {
    return await caches.match('/offline.html') || 
           new Response('Offline page not found', { status: 404 });
  } else if (isImageRequest(request)) {
    return new Response('', { 
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' },
      body: `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
        <rect width="300" height="200" fill="#f3f4f6"/>
        <text x="150" y="100" text-anchor="middle" font-family="Arial" font-size="14" fill="#6b7280">Image unavailable offline</text>
      </svg>`
    });
  } else {
    return new Response('Network error', { status: 408 });
  }
}

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle queued form submissions, analytics, etc.
  console.log('Background sync triggered');
}

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon-192.png',
      badge: '/images/badge-72.png',
      tag: data.tag || 'general',
      requireInteraction: data.requireInteraction || false,
      actions: data.actions || []
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action) {
    // Handle action buttons
    clients.openWindow(event.action);
  } else {
    // Handle main notification click
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});