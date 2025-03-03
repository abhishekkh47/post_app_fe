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

  return {
    notifications,
    unreadNotificationCount,
    getNotifications,
  };
};

export default useNotification;
