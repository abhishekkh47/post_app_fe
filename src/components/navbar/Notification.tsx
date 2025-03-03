import React from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { NotificationList } from "./";
import { useClickOutside, useNavBar, useNotification } from "../../hooks";

const Notification: React.FC = () => {
  const { notificationRef, openNotification, toggleNotificationList } =
    useNavBar();
  const { notifications, unreadNotificationCount } = useNotification();

  useClickOutside(notificationRef, openNotification, () => {
    toggleNotificationList(); // Explicitly close the dropdown
  });

  const handleNotificationIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleNotificationList();
  };

  return (
    <div ref={notificationRef}>
      <button
        type="button"
        className="relative rounded-full bg-gray-800 p-0 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden size-8"
        onClick={handleNotificationIconClick}
        aria-label="Cart"
      >
        {Number(unreadNotificationCount) > 0 && (
          <span className="absolute -inset-1 object-right-top -mr-6">
            <div className="inline-flex items-center justify-center h-4 w-4 px-0 border-1 border-white rounded-full text-[8px] font-medium bg-red-500 text-white">
              {Number(unreadNotificationCount) < 10
                ? unreadNotificationCount.toString()
                : "9+"}
            </div>
          </span>
        )}
        <BellIcon aria-hidden="true" className="size-8" />
        {openNotification && (
          <div className="absolute right-10 top-10">
            <NotificationList notifications={notifications} />
          </div>
        )}
      </button>
    </div>
  );
};

export default Notification;
