self.addEventListener('install', (e) => {
  console.log('Service Worker 설치됨');
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  console.log('Service Worker 활성화됨');
});

// 푸시 알림 수신
self.addEventListener('push', (e) => {
  const data = e.data.json();
  
  const options = {
    body: data.body,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/'
    }
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// 알림 클릭 시
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    clients.openWindow(e.notification.data.url)
  );
});