import { useState } from "react";
import { NOTIFICATION_TAB } from "../utils";
import useNavBar from "./useNavBar";
import { useNavigate } from "react-router-dom";
import { INotification } from "../types";

const useNavigationList = () => {
  const { toggleNotificationList } = useNavBar();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>(NOTIFICATION_TAB.ALL);

  const updateActiveTab = (tab: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTab(tab);
  };

  const handleNotificationClick = (notification: INotification) => {
    navigate(`/profile/${notification?.senderId?._id}`);
    toggleNotificationList(); // Close dropdown after navigation
  };

  return { activeTab, updateActiveTab, handleNotificationClick };
};

export default useNavigationList;
