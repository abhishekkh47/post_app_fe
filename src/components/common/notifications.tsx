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
  const [showModal, setShowModal] = useState(false);
  const [hasAskedBefore, setHasAskedBefore] = useState(false);

  useEffect(() => {
    // Initialize push notifications when component mounts
    const initializePushNotifications = async () => {
      // Check if push notifications are supported
      if (!isPushNotificationSupported()) {
        setError("Push notifications are not supported in this browser");
        return;
      }

      try {
        // Check existing permission
        const permission = Notification.permission;
        setUserPermission(permission);

        // If already granted, register and subscribe
        if (permission === "granted") {
          await registerServiceWorker();

          // Test notification directly from the component
          // if (registration) {
          //   console.log("Sending test notification...");
          //   await testNotification(registration);
          // }

          await subscribeUserToPush();
          // console.log("Push subscription successful:", subscription);
        }
      } catch (error) {
        setError("Failed to initialize notifications. Please try again.");
      }
    };

    initializePushNotifications();
  }, []);

  // const testNotification = async (registration: ServiceWorkerRegistration) => {
  //   try {
  //     await registration.showNotification("Test Notification", {
  //       body: "This is a test notification",
  //       icon: "https://asset.cloudinary.com/dwinhws99/db21266c28bd8d9d13a2b4089594ddb8",
  //     });
  //     console.log("Test notification sent successfully");
  //   } catch (error) {
  //     console.error("Error sending test notification:", error);
  //   }
  // };

  const requestPermission = async () => {
    try {
      setIsSubscribing(true);
      setError(null);

      const permission = await askUserPermission();
      setUserPermission(permission);

      if (permission === "granted") {
        await registerServiceWorker();

        // Send a test notification immediately after permission is granted
        // if (registration) {
        //   await testNotification(registration);
        // }

        await subscribeUserToPush();
      } else if (permission === "denied") {
        setError("Notification permission denied");
      }
    } catch (error) {
      setError("Failed to subscribe to notifications");
    } finally {
      setIsSubscribing(false);
    }
  };

  const dismissModal = () => {
    setShowModal(false);
    localStorage.setItem("notification_asked", "true");
    setHasAskedBefore(true);
  };

  // Show error message if there's an error
  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  // Show the modal if needed
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden transform transition-all">
            <div className="relative">
              {/* Header image */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={dismissModal}
                className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Stay Updated!
              </h3>
              <p className="text-gray-600 mb-4">
                Get notified about new messages, updates, and important events
                directly on your device.
              </p>

              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Never miss important updates
                </p>
              </div>

              <div className="flex items-start space-x-3 mb-4">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  Get instant message notifications
                </p>
              </div>

              <div className="flex items-start space-x-3 mb-6">
                <div className="flex-shrink-0 mt-0.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-sm text-gray-600">
                  You can disable notifications at any time
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button
                onClick={dismissModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                Not Now
              </button>
              <button
                onClick={requestPermission}
                disabled={isSubscribing}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none disabled:bg-blue-400"
              >
                {isSubscribing ? "Enabling..." : "Enable Notifications"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display a small button if we've asked before but permission is still not decided */}
      {!hasAskedBefore &&
        userPermission !== "granted" &&
        userPermission !== "denied" && (
          <div className="fixed bottom-4 left-4 z-40">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span>Enable Notifications</span>
            </button>
          </div>
        )}
    </>
  );

  // // Rendering a button only if permission hasn't been decided
  // if (userPermission !== "granted" && userPermission !== "denied") {
  //   return (
  //     <button
  //       onClick={requestPermission}
  //       disabled={isSubscribing}
  //       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 mt-10"
  //     >
  //       {isSubscribing ? "Enabling..." : "Enable Push Notifications"}
  //     </button>
  //   );
  // }

  // No need to render anything if permission is already decided and no errors
  return null;
};

export default NotificationInitializer;
