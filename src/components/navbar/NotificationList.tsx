import React, { useState } from "react";
import { INotification } from "../../types";
import { NOTIFICATION_TAB } from "../../utils";
import { useNavBar } from "../../hooks";

interface INotificationList {
  notifications: INotification[];
}

const NotificationList: React.FC<INotificationList> = ({ notifications }) => {
  const { toggleNotificationList } = useNavBar();
  const [activeTab, setActiveTab] = useState<string>(NOTIFICATION_TAB.ALL);
  const updateActiveTab = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const handleNotificationClick = (notificationId: string) => {
    // navigate(`/noti-nav/${notificationId}`); // Navigate to notification page
    console.log("notificationId : ", notificationId);
    toggleNotificationList(); // Close dropdown after navigation
  };
  return (
    <ul className="absolute mt-4 mr-50 bg-white rounded-md z-50 w-64">
      <div className="text-black text-lg font-bold justify-self-start mx-2 mt-1">
        Notifications
      </div>
      <div className="flex space-x-2 mx-2">
        <button
          className={`border text-gray-600 px-1 rounded-xl ${
            activeTab === NOTIFICATION_TAB.ALL ? "bg-indigo-500 text-white" : ""
          }`}
          onClick={(e) => {
            e.stopPropagation();
            updateActiveTab(NOTIFICATION_TAB.ALL, e);
          }}
        >
          All
        </button>
        <button
          className={`border text-gray-600 px-1 rounded-xl ${
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
        </button>
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
                onClick={() => handleNotificationClick(notification?._id)}
              >
                <div>
                  {sender?.profile_pic ? (
                    <img
                      src={sender?.profile_pic}
                      alt={sender?.firstName[0]}
                      className="w-9 h-9 min-w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="size-9 rounded-full bg-blue-300 flex items-center justify-center text-sm border border-black">
                      {sender?.firstName[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-left flex-1">
                  <p className="font-semibold">{`${sender.firstName} ${sender.lastName}`}</p>
                  <p>{`${notification.message}`}</p>
                </span>
                {!notification?.isRead ? (
                  <div className="w-3 h-3 min-w-3 bg-indigo-500 rounded-full"></div>
                ) : (
                  ""
                )}
              </li>
            );
        })}
    </ul>
  );
};

export default NotificationList;
