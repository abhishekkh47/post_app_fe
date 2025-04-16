// src/components/NotificationSetup.jsx
import { useEffect, useState } from "react";

function NotificationSetup() {
  const [status, setStatus] = useState("checking");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function setupNotifications() {
      try {
        // Check if service workers are supported
        if (!("serviceWorker" in navigator)) {
          setStatus("unsupported");
          setError("Service Workers not supported");
          return;
        }

        // Check if Push API is supported
        if (!("PushManager" in window)) {
          setStatus("unsupported");
          setError("Push API not supported");
          return;
        }

        // Register service worker
        console.log("Registering service worker...");
        const registration = await navigator.serviceWorker.register(
          "/service-worker.js"
        );
        console.log("Service Worker registered:", registration);

        // Check permission status
        const permissionStatus = Notification.permission;
        setStatus(permissionStatus);

        if (permissionStatus === "granted") {
          await subscribeUserToPush(registration);
        }
      } catch (err) {
        console.error("Error setting up notifications:", err);
        setError((err as Error).message);
        setStatus("error");
      }
    }

    setupNotifications();
  }, []);

  // Function to request permission and subscribe
  async function requestPermission() {
    try {
      const permission = await Notification.requestPermission();
      setStatus(permission);

      if (permission === "granted") {
        const registration = await navigator.serviceWorker.ready;
        await subscribeUserToPush(registration);
      }
    } catch (err) {
      console.error("Error requesting permission:", err);
      setError((err as Error).message);
    }
  }

  // Function to subscribe to push
  async function subscribeUserToPush(registration: any) {
    try {
      // Get your VAPID public key from the server
      const response = await fetch("/api/notifications/public-key");
      const vapidPublicKey = await response.text();

      // Convert the key to the format required by the browser
      const convertedKey = urlBase64ToUint8Array(vapidPublicKey);

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedKey,
      });

      console.log("User subscribed:", subscription);

      // Send the subscription to your server
      const userId = localStorage.getItem("userId"); // Get your user ID from wherever you store it

      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          userId,
        }),
      });

      console.log("Subscription sent to server");

      return subscription;
    } catch (err) {
      console.error("Error subscribing to push:", err);
      throw err;
    }
  }

  // Helper function to convert a base64 string to Uint8Array
  function urlBase64ToUint8Array(base64String: any) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  if (status === "checking") {
    return <div>Checking notification support...</div>;
  }

  if (status === "unsupported") {
    return <div>Push notifications are not supported in your browser.</div>;
  }

  if (status === "error") {
    return <div>Error setting up notifications: {error}</div>;
  }

  if (status === "default" || status === "denied") {
    return (
      <div>
        <button
          onClick={requestPermission}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Enable Push Notifications
        </button>
        {status === "denied" && (
          <p className="text-red-500 mt-2">
            Notifications are blocked. Please enable them in your browser
            settings.
          </p>
        )}
      </div>
    );
  }

  return <div>Push notifications are enabled!</div>;
}

export default NotificationSetup;
