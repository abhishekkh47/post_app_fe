import { useEffect, useState } from "react";
import { User } from "../types";
import { FollowService } from "../services";

interface useChatListProps {
  user: User;
}
const useChatList = ({ user }: useChatListProps) => {
  const [friends, setFriends] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPage, setModalPage] = useState(1);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    updateModalPage(1);
  };

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

  const updateModalPage = (page: number) => {
    setModalPage(page);
  };

  return {
    friends,
    isModalOpen,
    modalPage,
    openModal,
    closeModal,
    fetchFriends,
    updateModalPage,
  };
};

export default useChatList;
