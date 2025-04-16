// utils/notifications.ts
import { CommonService } from "../services";

// Check if the browser supports push notifications
export const isPushNotificationSupported = () => {
  return "serviceWorker" in navigator && "PushManager" in window;
};

// Ask user permission for notifications
export const askUserPermission = async () => {
  return await Notification.requestPermission();
};

// Register the service worker
export const registerServiceWorker = async () => {
  try {
    // Force update by adding a query parameter with timestamp
    const timestamp = new Date().getTime();
    const registration = await navigator.serviceWorker.register(
      `/service-worker.js?v=${timestamp}`,
      {
        scope: "/",
      }
    );
    console.log("Service Worker registered successfully:", registration);

    // Wait for the service worker to be ready
    await navigator.serviceWorker.ready;
    console.log("Service Worker is ready");

    return registration;
  } catch (error) {
    console.error("Service Worker registration failed:", error);
    throw error;
  }
};

// Subscribe user to push notifications
export const subscribeUserToPush = async () => {
  try {
    console.log("Waiting for service worker to be ready...");
    const registration = await navigator.serviceWorker.ready;
    console.log("Service worker is ready for push subscription");

    // Get the server's public key for VAPID
    const vapidPublicKey = import.meta.env.VITE_PUBLIC_VAPID_KEY;
    if (!vapidPublicKey) {
      throw new Error("VAPID public key is missing");
    }

    console.log("Using VAPID key:", vapidPublicKey);

    // Convert the public key to Uint8Array
    const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

    // Check for existing subscription
    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("Found existing subscription, sending to server...");
      await sendSubscriptionToServer(existingSubscription);
      return existingSubscription;
    }

    // Subscribe the user
    console.log("Creating new push subscription...");
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    console.log("Push subscription created:", subscription);

    // Send the subscription to your server
    await sendSubscriptionToServer(subscription);

    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push:", error);
    throw error;
  }
};

// Send the subscription to your server
const sendSubscriptionToServer = async (subscription: PushSubscription) => {
  try {
    console.log("Sending subscription to server:", subscription);
    const response = await CommonService.subscribeNotifications(subscription);
    console.log("Server response:", response);

    if (!response || response.status < 200 || response.status >= 300) {
      throw new Error("Failed to store subscription on server");
    }

    return response;
  } catch (error) {
    console.error("Error sending subscription to server:", error);
    throw error;
  }
};

// Helper function to convert a base64 string to Uint8Array
// Required for the applicationServerKey
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

// Test function to send a notification directly
export const sendTestNotification = async () => {
  if (!isPushNotificationSupported()) {
    console.log("Push notifications not supported");
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification("Test Notification", {
      body: "This is a test notification from the app",
      icon: "https://asset.cloudinary.com/dwinhws99/db21266c28bd8d9d13a2b4089594ddb8",
    });
    return true;
  } catch (error) {
    console.error("Failed to send test notification:", error);
    return false;
  }
};
