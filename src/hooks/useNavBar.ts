import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useClickOutside from "./useClickOutside";

const useNavBar = () => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleDashboardClick = async () => {
    navigate(`/`);
  };
  const navigation = [
    {
      name: "Home",
      href: "/",
      current: true,
    },
    {
      name: "Friends",
      href: "/friends",
      current: false,
    },
    {
      name: "Explore",
      href: "/explore",
      current: false,
    },
    {
      name: "Settings",
      href: `/settings/${user?._id}`,
      current: false,
    },
    {
      name: "Messages",
      href: `/messages`,
      current: false,
    },
  ];

  const handleLogOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoggingOut(true);
      logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Logout Failed : ", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  /**
   * close notification dropdown when clicked somewhere else on the screen
   */
  useClickOutside(notificationRef, openNotification, () => {
    toggleNotificationList();
  });

  const toggleNotificationList = () => {
    setOpenNotification(!openNotification);
  };
  return {
    user,
    navigation,
    isLoggingOut,
    openNotification,
    notificationRef,
    handleLogOutClick,
    toggleNotificationList,
    handleDashboardClick,
  };
};

export default useNavBar;
