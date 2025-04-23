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
  const handleFriendsClick = async () => {
    navigate(`/friends`);
  };
  const handleSettingsClick = async () => {
    navigate(`/settings/${user?._id}`);
  };
  const handleExploreClick = async () => {
    navigate(`/explore`);
  };
  const handleProfileClick = async () => {
    navigate(`/profile/${user?._id}`);
  };
  const handleMessageClick = async () => {
    navigate(`/messages`);
  };
  const navigation = [
    {
      name: "Home",
      href: "/",
      current: true,
      onClick: handleDashboardClick,
    },
    {
      name: "Friends",
      href: "/friends",
      current: false,
      onClick: handleFriendsClick,
    },
    {
      name: "Explore",
      href: "/explore",
      current: false,
      onclick: handleExploreClick,
    },
    {
      name: "Settings",
      href: `/settings/${user?._id}`,
      current: false,
      onClick: handleSettingsClick,
    },
    {
      name: "Messages",
      href: `/messages`,
      current: false,
      onClick: handleMessageClick,
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
    handleProfileClick,
    toggleNotificationList,
    handleDashboardClick,
  };
};

export default useNavBar;
