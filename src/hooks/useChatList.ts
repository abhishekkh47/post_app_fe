import { useEffect, useState } from "react";
import { User } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService } from "../services";
import { CreateChatGroup } from "../components/chat";

const useChatList = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    updateModalPage(1);
  };
  const { user } = useAuth();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      if (user) {
        const myFriends = await FollowService.getFriends();
        setFriends(myFriends.friends || []);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleGroupChatClick = async () => {
    return CreateChatGroup;
  };

  const updateModalPage = (page: number) => {
    setModalPage(page);
  };

  return {
    friends,
    isModalOpen,
    modalPage,
    openModal,
    closeModal,
    handleGroupChatClick,
    fetchFriends,
    updateModalPage,
  };
};

export default useChatList;
