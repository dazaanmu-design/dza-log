const CACHE_NAME = 'dza-log-shell-v17';
const APP_SHELL = ['./index.html','./manifest.webmanifest'];
self.addEventListener('install', event => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('dza-log-shell-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req, {cache:'no-store'}).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
      return res;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  event.respondWith(fetch(req).then(res => {
    if(res && (res.ok || res.type === 'opaque')){
      const copy=res.clone();
      caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));
    }
    return res;
  }).catch(()=>caches.match(req)));
});
