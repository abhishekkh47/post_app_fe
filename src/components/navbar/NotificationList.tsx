import React, { useState } from "react";
import { INotification } from "../../types";
import { NOTIFICATION_TAB } from "../../utils";

interface INotificationList {
  notifications: INotification[];
}

const NotificationList: React.FC<INotificationList> = ({ notifications }) => {
  const [activeTab, setActiveTab] = useState<string>(NOTIFICATION_TAB.ALL);
  const updateActiveTab = (tab: string) => {
    setActiveTab(tab);
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
          onClick={() => updateActiveTab(NOTIFICATION_TAB.ALL)}
        >
          All
        </button>
        <button
          className={`border text-gray-600 px-1 rounded-xl ${
            activeTab === NOTIFICATION_TAB.UNREAD
              ? "bg-indigo-500 text-white"
              : ""
          }`}
          onClick={() => updateActiveTab(NOTIFICATION_TAB.UNREAD)}
        >
          Unread
        </button>
      </div>
      {notifications?.length &&
        notifications.map((notification) => {
          const sender = notification?.senderId;
          return (
            <li className="flex flex-row space-x-2 items-center text-black p-2">
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
                {/* {`${sender.firstName} ${notification.message}`} */}
              </span>
              <div className="w-3 h-3 min-w-3 bg-pink-500 rounded-full"></div>
            </li>
          );
        })}
    </ul>
  );
};

export default NotificationList;
