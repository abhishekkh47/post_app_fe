import React from "react";
import { INotification } from "../../types";
import { NOTIFICATION_TAB } from "../../utils";
import { useNotificationList } from "../../hooks";
import { ProfilePicture } from "../profile";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

interface INotificationList {
  notifications: INotification[];
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationAsRead: () => void;
}

const NotificationList: React.FC<INotificationList> = ({
  notifications,
  markNotificationAsRead,
  markAllNotificationAsRead,
}) => {
  const {
    activeTab,
    updateActiveTab,
    handleNotificationClick,
    readAllNotification,
  } = useNotificationList({
    markNotificationAsRead,
    markAllNotificationAsRead,
  });

  return (
    <ul className="absolute mt-4 right-0 bg-white rounded-md z-50 w-64 sm:w-80 max-h-96 overflow-y-auto shadow-lg">
      <div className="relative flex items-center justify-center py-2 border-b">
        <div className="text-black text-lg font-bold">Notifications</div>
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Menu as="div" className="relative">
            <div className="justify-self-end">
              <MenuButton
                className="relative flex focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <EllipsisHorizontalIcon className="h-6 w-6 text-gray-600" />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                <a
                  onClick={readAllNotification}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                >
                  Mark all as read
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  onClick={() => {
                    // updateOpenGroupInviteOptions();
                  }}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden hover:cursor-pointer"
                >
                  Notification settings
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </div>
      <div className="flex space-x-2 mx-2 mb-2">
        <div
          className={`border text-gray-600 px-2 rounded-xl ${
            activeTab === NOTIFICATION_TAB.ALL ? "bg-indigo-500 text-white" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            updateActiveTab(NOTIFICATION_TAB.ALL, e);
          }}
        >
          All
        </div>
        <div
          className={`border text-gray-600 px-2 rounded-xl ${
            activeTab === NOTIFICATION_TAB.UNREAD
              ? "bg-indigo-500 text-white"
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            updateActiveTab(NOTIFICATION_TAB.UNREAD, e);
          }}
        >
          Unread
        </div>
      </div>
      {notifications?.length &&
        notifications.map((notification) => {
          const sender = notification?.senderId;
          if (
            (activeTab == NOTIFICATION_TAB.UNREAD && !notification?.isRead) ||
            activeTab == NOTIFICATION_TAB.ALL
          )
            return (
              <li
                key={notification?._id}
                className="flex flex-row space-x-2 items-center text-black p-2 cursor-pointer hover:bg-gray-100"
                onClick={() => handleNotificationClick(notification)}
              >
                <ProfilePicture
                  profile_pic={sender?.profile_pic}
                  firstName={sender.firstName}
                  size={8}
                  text={`sm`}
                  className={`w-8`}
                />
                <span className="text-left flex-1">
                  <p className="font-semibold">{`${sender.firstName} ${sender.lastName}`}</p>
                  <p className="text-sm text-gray-600">{`${notification.message}`}</p>
                </span>
                {!notification?.isRead && (
                  <div className="w-3 h-3 min-w-3 bg-indigo-500 rounded-full"></div>
                )}
              </li>
            );
        })}
    </ul>
  );
};

export default NotificationList;
