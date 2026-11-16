const N='series-v7';
self.addEventListener('install',e=>{e.waitUntil(caches.open(N).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon.svg'])));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(clients.claim()));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!='GET'||u.origin!==location.origin)return;
 e.respondWith(fetch(e.request).then(r=>{const k=r.clone();caches.open(N).then(c=>c.put(e.request,k));return r}).catch(()=>caches.match(e.request)))});
