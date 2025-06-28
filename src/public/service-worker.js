const CACHE_NAME = "notes-app-v1";
const urlsToCache = ["/", "/index.html", "/manifest.json", "/images/logo.png"];
const IMAGE_CACHE_NAME = "story-image-cache";
import { BASE_URL } from "../scripts/config";
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      Promise.all(
        cacheNames
          .filter(
            (cacheName) =>
              cacheName !== CACHE_NAME && cacheName !== IMAGE_CACHE_NAME
          )
          .map((cacheName) => {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  if (
    requestUrl.origin === BASE_URL &&
    requestUrl.pathname.startsWith("/images/stories")
  ) {
    event.respondWith(
      caches.open(IMAGE_CACHE_NAME).then((cache) => {
        cache.match(event.request).then((cachedresponse) => {
          if (cachedresponse) {
            return cachedresponse;
          }
          return fetch(event.request)
            .then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
            .catch(() => caches.match("/images/logo.png"));
        });
      })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("push", (event) => {
  let title = "New Notification";
  let options = {
    body: "You have a new notification.",
    icon: "/images/logo.png",
    badge: "/images/logo.png",
  };
  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      options.body = data.body || options.body;
      options.icon = data.icon || options.icon;
      options.badge = data.badge || options.badge;
    } catch (error) {
      const text = event.data.text();
      options.body = text;
      event.waitUntil(self.registration.showNotification(title, options));
      return;
    }
  }
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("message", (event) => {
  console.log("service worker received message:", event.data);
  if (event.data && event.data.type === "SHOW_MAP_NOTIFICATION") {
    const { title, body, icon, badge } = event.data;
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
    });
  }
});
