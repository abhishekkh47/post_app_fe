import { useEffect, useState } from "react";
import { NotificationService } from "../services";
import { INotification } from "../types";
import { useSocket } from "../context/SocketContext";
import { WS_EVENTS } from "../utils";

const useNotification = () => {
  const { socket } = useSocket();
  const {
    NOTIFICATIONS: {
      LISTENER: { POST_LIKED, COMMENT_REPLY, POST_COMMENT },
    },
  } = WS_EVENTS;

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadNotificationCount, setUnreadNotificationCount] =
    useState<Number>(0);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on(POST_LIKED, getNotifications);
    socket.on(COMMENT_REPLY, getNotifications);
    socket.on(POST_COMMENT, getNotifications);

    return () => {
      socket.off(POST_LIKED);
      socket.off(COMMENT_REPLY);
      socket.off(POST_COMMENT);
    };
  }, [socket]);

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

  const markAllNotificationAsRead = async () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => {
        return { ...notification, isRead: true };
      })
    );
    setUnreadNotificationCount(0);
  };

  return {
    notifications,
    unreadNotificationCount,
    getNotifications,
    markNotificationAsRead,
    markAllNotificationAsRead,
  };
};

export default useNotification;
