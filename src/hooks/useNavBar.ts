import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const useNavBar = () => {
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [selected, setSelected] = useState("Home");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Update the selected navigation item based on the current route path
    if (location.pathname === "/friends") {
      setSelected("Friends");
    } else if (location.pathname === "/projects") {
      setSelected("Projects");
    } else if (location.pathname === "/calendar") {
      setSelected("Calendar");
    } else {
      setSelected("Home"); // Default is home
    }
  }, [location.pathname]); // Re-run when the location (URL) changes

  const handleDashboardClick = async () => {
    navigate(`/`);
  };
  const handleFriendsClick = async () => {
    navigate(`/friends`);
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
    { name: "Projects", href: "#", current: false },
    { name: "Calendar", href: "#", current: false },
  ];

  const handleLogOutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoggingOut(true);
      logout();
      navigate("/auth/login", { replace: true });
    } catch (error) {
      console.log("Logout Failed : ", error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  const handleProfileClick = async () => {
    navigate(`/profile/${user?._id}`);
  };

  return {
    user,
    navigation,
    isLoggingOut,
    selected,
    handleLogOutClick,
    handleProfileClick,
  };
};

export default useNavBar;
