import { useState } from "react";
import { NOTIFICATION_TAB, NOTIFICATION_TYPE } from "../utils";
import useNavBar from "./useNavBar";
import { useNavigate } from "react-router-dom";
import { INotification } from "../types";
import { NotificationService } from "../services";

interface INotificationList {
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationAsRead: () => void;
}

const useNotificationList = ({
  markNotificationAsRead,
  markAllNotificationAsRead,
}: INotificationList) => {
  const { toggleNotificationList } = useNavBar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(NOTIFICATION_TAB.ALL);

  const updateActiveTab = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const handleNotificationClick = async (notification: INotification) => {
    if (
      notification?.type === NOTIFICATION_TYPE.FOLLOW ||
      !notification?.type
    ) {
      navigate(`/profile/${notification?.senderId?._id}`);
    } else if (
      (notification?.type === NOTIFICATION_TYPE.COMMENT ||
        notification?.type === NOTIFICATION_TYPE.LIKE) &&
      notification?.contentId
    ) {
      navigate(`/post/${notification?.contentId}`);
    }
    toggleNotificationList(); // Close dropdown after navigation
    if (!notification.isRead) {
      markNotificationAsRead(notification._id);
      await readNotification(notification._id);
    }
  };

  const readNotification = async (notificationId: string) => {
    await NotificationService.readNotifications(notificationId);
  };

  const readAllNotification = async () => {
    markAllNotificationAsRead();
    await NotificationService.readAllNotifications();
  };

  return {
    activeTab,
    updateActiveTab,
    handleNotificationClick,
    readAllNotification,
  };
};

export default useNotificationList;
