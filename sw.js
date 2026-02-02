const version = 'v1.1';
const assets = [
  './', './index.html', './style.css', './script.js', './vault.json',
  './stone-texture.jpg', './paper-sounds-46696.mp3', './writingpensignaturepaper-102967.mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(version).then(cache => cache.addAll(assets)));
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});
