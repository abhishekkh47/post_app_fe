import { useState, useEffect } from "react";
import { Message, User } from "../types";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { FollowService } from "../services";
import { WS_EVENTS } from "../utils";

const useFriendSuggestions = () => {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]); // Store messages
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();

  const {
    CHAT: {
      LISTENER: { MESSAGE_MARKED_READ },
    },
  } = WS_EVENTS;

  // Fetch data based on selected tab
  useEffect(() => {
    fetchFriendRecommendation();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on(MESSAGE_MARKED_READ, () => {
      updateMessagesReadStatus();
    });

    return () => {
      socket.off(MESSAGE_MARKED_READ);
    };
  }, [socket, messages]);

  const fetchFriendRecommendation = async () => {
    setLoading(true);
    try {
      if (user) {
        const response = await FollowService.getFriendRecommendation();
        setFriends(response?.friends);
      }
    } catch (error) {
      console.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendClick = async (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const updateMessagesReadStatus = () => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => ({
        ...message,
        isRead: true,
      }))
    );
  };

  return {
    friends,
    loading,
    handleFriendClick,
  };
};

export default useFriendSuggestions;
