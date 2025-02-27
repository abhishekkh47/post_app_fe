import { useState } from "react";
import { UserService } from "../services";
import { INotification } from "../types";

const useNotification = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const updateNotifications = (notifications: INotification[]) => {
    setNotifications(notifications);
  };

  const getNotifications = async () => {
    const data = (await UserService.getNotifications()).notifications;
    updateNotifications(data);
  };

  return { notifications, getNotifications };
};

export default useNotification;
