import { useState } from "react";
import { NOTIFICATION_TAB } from "../utils";
import useNavBar from "./useNavBar";
import { useNavigate } from "react-router-dom";
import { INotification } from "../types";
import { NotificationService } from "../services";

interface INotificationList {
  markNotificationAsRead: (notificationId: string) => void;
}

const useNotificationList = ({ markNotificationAsRead }: INotificationList) => {
  const { toggleNotificationList } = useNavBar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(NOTIFICATION_TAB.ALL);

  const updateActiveTab = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const handleNotificationClick = async (notification: INotification) => {
    navigate(`/profile/${notification?.senderId?._id}`);
    toggleNotificationList(); // Close dropdown after navigation
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
      await readNotification(notification._id);
    }
  };

  const readNotification = async (notificationId: string) => {
    await NotificationService.readNotifications(notificationId);
  };

  return {
    activeTab,
    updateActiveTab,
    handleNotificationClick,
  };
};

export default useNotificationList;
