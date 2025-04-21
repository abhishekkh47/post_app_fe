import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useClickOutside from "./useClickOutside";

const useNavBar = () => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("Home");
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Update the selected navigation item based on the current route path
    if (location.pathname === "/friends") {
      setSelected("Friends");
    } else if (location.pathname === "/projects") {
      setSelected("Projects");
    } else if (location.pathname === `/settings/${user?._id}`) {
      setSelected("Settings");
    } else if (location.pathname === `/messages`) {
      setSelected("Settings");
    } else if (location.pathname === "/") {
      setSelected("Home"); // Default is home
    } else {
      setSelected("");
    }
  }, [location.pathname]); // Re-run when the location (URL) changes

  const handleDashboardClick = async () => {
    navigate(`/`);
  };
  const handleFriendsClick = async () => {
    navigate(`/friends`);
  };
  const handleSettingsClick = async () => {
    navigate(`/settings/${user?._id}`);
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
    { name: "Games", href: "#", current: false },
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
    selected,
    openNotification,
    notificationRef,
    handleLogOutClick,
    handleProfileClick,
    toggleNotificationList,
    handleDashboardClick,
  };
};

export default useNavBar;
