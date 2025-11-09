const CACHE_NAME = 'drivers-dash-cache-v2'; // Bump version to force update
const urlsToCache = [
  '.',
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './hooks/useLocalStorage.tsx',
  './services/geminiService.ts',
  './components/Icons.tsx',
  './components/BottomNav.tsx',
  './components/StatCard.tsx',
  './components/AddEntryModal.tsx',
  './screens/DashboardScreen.tsx',
  './screens/HistoryScreen.tsx',
  './screens/ChartsScreen.tsx',
  './screens/GoalsScreen.tsx',
  './screens/InsightsScreen.tsx',
  './screens/SettingsScreen.tsx',
  './icons/icon-72x72.png',
  './icons/icon-96x96.png',
  './icons/icon-128x128.png',
  './icons/icon-144x144.png',
  './icons/icon-152x152.png',
  './icons/icon-192x192.png',
  './icons/icon-384x384.png',
  './icons/icon-512x512.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/@babel/standalone/babel.min.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching files');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});