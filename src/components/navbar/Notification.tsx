import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationList } from "./";
import { useClickOutside, useNavBar, useNotification } from "../../hooks";

const Notification: React.FC = () => {
  const { notificationRef, openNotification, toggleNotificationList } =
    useNavBar();
  const { notifications, unreadNotificationCount, markNotificationAsRead } =
    useNotification();

  useClickOutside(notificationRef, openNotification, () => {
    toggleNotificationList(); // Explicitly close the dropdown
  });

  const handleNotificationIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNotificationList();
  };

  return (
    <div ref={notificationRef} className="relative">
      <button
        type="button"
        className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
        onClick={handleNotificationIconClick}
        aria-label="Cart"
      >
        {Number(unreadNotificationCount) > 0 && (
          <span className="absolute -top-0 -right-0 flex items-center justify-center h-4 w-4 text-[10px] font-medium bg-red-500 text-white rounded-full">
            {Number(unreadNotificationCount) < 10
              ? unreadNotificationCount.toString()
              : "9+"}
          </span>
        )}
        <BellIcon aria-hidden="true" className="size-8" />
        {openNotification && (
          <div className="absolute right-0 top-10 w-64 sm:w-80">
            <NotificationList
              notifications={notifications}
              markNotificationAsRead={markNotificationAsRead}
            />
          </div>
        )}
      </button>
    </div>
  );
};

export default Notification;
