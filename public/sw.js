/**
 * Service Worker — Developer Roadmaps
 *
 * Caching strategies:
 *  • Cache First  → /_next/static/** (immutable content-hashed bundles)
 *  • Cache First  → public assets (SVG, images)
 *  • Network First → HTML page navigations, with offline fallback
 *  • Stale-While-Revalidate → everything else
 */

const CACHE_VERSION = 'roadmap-v1';
const OFFLINE_URL = '/offline';

// Pages to pre-cache on install so they're available offline immediately
const PRECACHE_ROUTES = [
  '/',
  '/roadmaps',
  '/guides',
  '/projects',
  '/resources',
  '/about',
  '/offline',
];

// ─── Install ──────────────────────────────────────────────────────────────────

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_ROUTES))
      .then(() => self.skipWaiting()),
  );
});

// ─── Activate (clean up old caches) ──────────────────────────────────────────

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests from our own origin
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // ── Strategy 1: Cache First — Next.js static chunks (content-hashed, immutable)
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // ── Strategy 2: Cache First — public static assets (SVGs, images)
  if (/\.(svg|png|ico|webp|jpg|jpeg|gif|woff2?)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // ── Strategy 3: Network First — HTML page navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstWithOfflineFallback(event.request));
    return;
  }

  // ── Strategy 4: Stale-While-Revalidate — everything else
  event.respondWith(staleWhileRevalidate(event.request));
});

// ─── Message (force update from app) ─────────────────────────────────────────

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_VERSION);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_VERSION);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    // Last resort: show the offline page
    return caches.match(OFFLINE_URL);
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_VERSION);
  const cached = await cache.match(request);

  const networkFetch = fetch(request).then((response) => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  });

  return cached ?? networkFetch;
}
