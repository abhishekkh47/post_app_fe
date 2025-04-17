// public/service-worker.js
console.log("Service worker loaded!");

self.addEventListener("push", (event) => {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    // console.error("Error parsing push data:", e);
    data = {
      title: "New Notification",
      body: "You have a new notification",
      url: "/",
    };
  }

  const options = {
    body: data.body,
    icon:
      data.icon ||
      "https://asset.cloudinary.com/dwinhws99/db21266c28bd8d9d13a2b4089594ddb8",
    badge:
      data.badge ||
      "https://asset.cloudinary.com/dwinhws99/db21266c28bd8d9d13a2b4089594ddb8",
    data: {
      url: data.url || "/",
    },
  };

  // Only use one notification call, wrapped in waitUntil
  event.waitUntil(
    self.registration
      .showNotification(data.title, options)
      .then(() => console.log("Notification shown successfully"))
      .catch((err) => {
        console.error("Notification error:", err);
      })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow(event.notification.data.url || "/"));
});

// Log when service worker is installed
self.addEventListener("install", (event) => {
  // console.log("Service Worker installed!");
  self.skipWaiting(); // Ensures the service worker activates right away
});

// Log when service worker is activated
self.addEventListener("activate", (event) => {
  // console.log("Service Worker activated!");
  // Take control of all clients immediately
  event.waitUntil(clients.claim());
});
