import { VAPID_PUBLIC_KEY } from "../config";
import { urlBase64ToUint8Array } from "../index";
export function isNotificationAvailable() {
  return "Notification" in window;
}

export function isNotificationGranted() {
  return Notification.permission === "granted";
}

export async function requestNotificationPermission() {
  if (!isNotificationAvailable()) {
    console.error("Notification API is not available in this browser.");
    return false;
  }

  if (isNotificationGranted()) {
    console.log("Notification permission already granted.");
    return true;
  }

  const status = await Notification.requestPermission();
  if (status === "denied") {
    alert("Izin notifikasi ditolak");
    return false;
  }

  if (status === "default") {
    alert("Izin notifikasi ditutup atau diabaikan");
    return false;
  }

  return true;
}

export async function getPushSubscription() {
  const registration = await navigator.serviceWorker.getRegistration();
  return await registration.pushManager.getSubscription();
}

export async function isCurrentPushSubscriptionAvailable() {
  return !!(await getPushSubscription());
}

export async function subscribe() {
  console.log("Subscribe dipanggil");
  if (!(await requestNotificationPermission())) {
    return;
  }
  if (await isCurrentPushSubscriptionAvailable()) {
    alert("Sudah berlangganan push notification");
    return;
  }
  try {
    const registeration = await navigator.serviceWorker.getRegistration();
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    };
    const pushSubscription =
      await registeration.pushManager.subscribe(subscribeOptions);
    alert("Berhasil berlangganan push notification");
  } catch (error) {
    alert("Gagal berlangganan push notification");
    console.error(error);
  }
}

export async function unsubscribe() {
  console.log("Unsubscribing dipanggil");
  const subscription = await getPushSubscription();
  if (!subscription) {
    alert("Tidak ada langganan yang ditemukan");
    return;
  }

  try {
    const unsubscribe = await subscription.unsubscribe();
    if (unsubscribe) {
      alert("Berhasil membatalkan langganan");
    } else {
      alert("Gagal membatalkan langganan");
    }
  } catch (error) {
    console.error("Gagal membatalkan langganan:", error);
    alert("Gagal membatalkan langganan");
  }
}
