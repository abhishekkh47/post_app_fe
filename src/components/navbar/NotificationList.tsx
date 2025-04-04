import React from "react";
import { INotification } from "../../types";
import { NOTIFICATION_TAB } from "../../utils";
import { useNotificationList } from "../../hooks";
import { ProfilePicture } from "../profile";

interface INotificationList {
  notifications: INotification[];
  markNotificationAsRead: (notificationId: string) => void;
}

const NotificationList: React.FC<INotificationList> = ({
  notifications,
  markNotificationAsRead,
}) => {
  const { activeTab, updateActiveTab, handleNotificationClick } =
    useNotificationList({ markNotificationAsRead });

  return (
    <ul className="absolute mt-4 mr-50 bg-white rounded-md z-50 w-64">
      <div className="text-black text-lg font-bold justify-self-start mx-2 mt-1">
        Notifications
      </div>
      <div className="flex space-x-2 mx-2">
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
                  size={9}
                  text={`sm`}
                  className={`min-w-9`}
                />
                <span className="text-left flex-1">
                  <p className="font-semibold">{`${sender.firstName} ${sender.lastName}`}</p>
                  <p>{`${notification.message}`}</p>
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
