import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationList } from "./";
import { useNavBar, useNotification } from "../../hooks";

const Notification: React.FC = () => {
  const { notificationRef, openNotification, toggleNotificationList } =
    useNavBar();
  const { notifications, getNotifications } = useNotification();

  const handleNotificationClick = () => {
    getNotifications();
    toggleNotificationList();
  };

  return (
    <div ref={notificationRef}>
      <button
        type="button"
        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden size-8"
        onClick={handleNotificationClick}
      >
        {/* <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span> */}
        <BellIcon aria-hidden="true" className="size-6" />
        {openNotification && <NotificationList notifications={notifications} />}
      </button>
    </div>
  );
};

export default Notification;
