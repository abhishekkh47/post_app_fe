import React from "react";
import { INotification } from "../../types";

interface INotificationList {
  notifications: INotification[];
}

const NotificationList: React.FC<INotificationList> = ({ notifications }) => {
  return (
    <ul className="absolute mt-4 mr-50 bg-white rounded-md z-50 w-60">
      <div className="text-black text-lg font-semibold">Notifications</div>
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
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-9 rounded-full bg-blue-300 flex items-center justify-center text-sm border border-black">
                    {sender?.firstName[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <span className="text-left">{`${sender.firstName} ${notification.message}`}</span>
            </li>
          );
        })}
    </ul>
  );
};

export default NotificationList;
