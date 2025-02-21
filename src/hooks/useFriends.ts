import { useState, useEffect } from "react";
import { Message, User } from "../types";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { ChatService, FollowService } from "../services";

const useFriends = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Store messages
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Fetch data based on selected tab
  useEffect(() => {
    fetchFriends(activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("message_marked_read", () => {
      updateMessagesReadStatus();
    });

    return () => {
      socket.off("message_marked_read");
    };
  }, [socket, messages]);

  const updateActiveTab = (tab: "followers" | "following") => {
    setActiveTab(tab);
  };

  const updateMessages = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const fetchFriends = async (type: "followers" | "following") => {
    setLoading(true);
    try {
      if (user) {
        const response = await FollowService.getFollowersOrFollowing(
          user._id,
          type
        );
        const data =
          type == "followers" ? response?.followers : response?.following;
        setFriends(data?.users || []);
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

  const handleMessageClick = async (friend: User, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to profile
    setSelectedUser(friend);

    // Fetch messages for the selected user
    try {
      const data = await ChatService.getMessages(friend._id);
      setMessages(data.messages || []);

      // Mark messages as read
      if (socket) {
        socket.emit("mark_read", {
          receiverId: friend._id,
        });
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!socket || !selectedUser) return;

    const newMessage: Message = {
      _id: Date.now().toString(), // You can generate this dynamically or use the server's ID
      senderId: user!,
      receiverId: selectedUser,
      content,
      isRead: false,
      attachments,
      createdAt: new Date().toISOString(),
    };

    // Update the messages state immediately with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("private_message", {
      receiverId: selectedUser._id,
      content,
      attachments,
    });
  };

  // Function to close chat popup
  const handleCloseChat = () => {
    setSelectedUser(null);
    setMessages([]);
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
    selectedUser,
    messages,
    activeTab,
    updateActiveTab,
    updateMessages,
    handleFriendClick,
    handleMessageClick,
    handleSendMessage,
    handleCloseChat,
  };
};

export default useFriends;
