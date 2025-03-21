import { useEffect, useState } from "react";
import { NotificationService } from "../services";
import { INotification } from "../types";

const useNotification = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<Number>(0);

  const updateNotifications = (notifications: INotification[]) => {
    setNotifications(notifications);
  };

  const getNotifications = async () => {
    const data = (await NotificationService.getNotifications()).notifications;
    const unreadNotifications = data.filter(
      (n: INotification) => !n.isRead
    ).length;
    updateNotifications(data);
    updateUnreadNotification(unreadNotifications);
  };

  const updateUnreadNotification = (numOfUnreadNoti: Number) => {
    setUnreadNotificationCount(numOfUnreadNoti);
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const markNotificationAsRead = async (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => {
        if (notification._id === notificationId) {
          return { ...notification, isRead: true };
        }
        return notification;
      })
    );
    setUnreadNotificationCount(
      Number(unreadNotificationCount) > 0
        ? Number(unreadNotificationCount) - 1
        : 0
    );
  };

  return {
    notifications,
    unreadNotificationCount,
    getNotifications,
    markNotificationAsRead,
  };
};

export default useNotification;
