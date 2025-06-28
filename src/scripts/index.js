// CSS imports
import "../styles/styles.css";
import "leaflet/dist/leaflet.css";
import { VAPID_PUBLIC_KEY } from "./config";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  if ("Notification" in window && Notification.permission === "default") {
    try {
      await Notification.requestPermission();
    } catch (error) {
      Notification.requestPermission();
    }
  }

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    const registration =
      await navigator.serviceWorker.register("/service-worker.js");
    if (!navigator.serviceWorker.controller) {
      window.location.reload();
      return;
    }
    if ("pushManager" in window) {
      const vapidPublicKey = VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      try {
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey,
        });
        console.log("Push subscription:", subscription);
      } catch (error) {
        console.error("Failed to subscribe to push notifications:", error);
      }
    }
  });
}

export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}
