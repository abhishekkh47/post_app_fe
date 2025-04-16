// src/components/NotificationInitializer.tsx
import { useEffect, useState } from "react";
import {
  isPushNotificationSupported,
  askUserPermission,
  registerServiceWorker,
  subscribeUserToPush,
} from "../../utils";

const NotificationInitializer: React.FC = () => {
  const [userPermission, setUserPermission] = useState<string | null>(null);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize push notifications when component mounts
    const initializePushNotifications = async () => {
      // Check if push notifications are supported
      if (!isPushNotificationSupported()) {
        console.log("Push notifications not supported");
        setError("Push notifications are not supported in this browser");
        return;
      }

      try {
        // Check existing permission
        const permission = Notification.permission;
        setUserPermission(permission);

        // If already granted, register and subscribe
        if (permission === "granted") {
          console.log("Permission already granted, initializing...");
          const registration = await registerServiceWorker();
          console.log("Service worker registered:", registration);

          // Test notification directly from the component
          if (registration) {
            console.log("Sending test notification...");
            await testNotification(registration);
          }

          const subscription = await subscribeUserToPush();
          console.log("Push subscription successful:", subscription);
        }
      } catch (error) {
        console.error("Error initializing push notifications:", error);
        setError("Failed to initialize notifications. Please try again.");
      }
    };

    initializePushNotifications();
  }, []);

  const testNotification = async (registration: ServiceWorkerRegistration) => {
    try {
      await registration.showNotification("Test Notification", {
        body: "This is a test notification",
        icon: "https://asset.cloudinary.com/dwinhws99/db21266c28bd8d9d13a2b4089594ddb8",
      });
      console.log("Test notification sent successfully");
    } catch (error) {
      console.error("Error sending test notification:", error);
    }
  };

  const requestPermission = async () => {
    try {
      setIsSubscribing(true);
      setError(null);

      const permission = await askUserPermission();
      setUserPermission(permission);

      if (permission === "granted") {
        const registration = await registerServiceWorker();
        console.log("Service worker registered:", registration);

        // Send a test notification immediately after permission is granted
        if (registration) {
          await testNotification(registration);
        }

        const subscription = await subscribeUserToPush();
        console.log("Push subscription successful:", subscription);
      } else if (permission === "denied") {
        setError("Notification permission denied");
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      setError("Failed to subscribe to notifications");
    } finally {
      setIsSubscribing(false);
    }
  };

  // Rendering a button only if permission hasn't been decided
  if (userPermission !== "granted" && userPermission !== "denied") {
    return (
      <button
        onClick={requestPermission}
        disabled={isSubscribing}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {isSubscribing ? "Enabling..." : "Enable Push Notifications"}
      </button>
    );
  }

  // Show error message if there's an error
  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  // No need to render anything if permission is already decided and no errors
  return null;
};

export default NotificationInitializer;
