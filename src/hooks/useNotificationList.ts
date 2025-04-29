import { useEffect, useRef, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateMenuOpen = () => {
    setMenuOpen((prev) => !prev);
  };

  return {
    activeTab,
    menuOpen,
    menuRef,
    updateActiveTab,
    handleNotificationClick,
    readAllNotification,
    updateMenuOpen,
  };
};

export default useNotificationList;
