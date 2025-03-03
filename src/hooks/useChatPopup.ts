import { useEffect, useRef, useState } from "react";
import { Message, User } from "../types";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";

interface UseChatProps {
  selectedUser: User | null;
  messages: Message[];
  updateMessages: (newMessage: Message) => void;
  onSendMessage: (content: string, attachments?: string[]) => void;
}

const useChatPopup = ({
  selectedUser,
  messages,
  updateMessages,
  onSendMessage,
}: UseChatProps) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

  // Listen for incoming messages from the WebSocket server
  useEffect(() => {
    if (socket) {
      socket.on("new_message", (newMessage: Message) => {
        if (selectedUser && newMessage.senderId._id === selectedUser._id) {
          updateMessages(newMessage);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off("new_message");
      };
    }
  }, [selectedUser, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      socket.on("user_typing", (data: { userId: string }) => {
        if (selectedUser?._id == data.userId) {
          updateTypingStatus(true);

          setTimeout(() => {
            updateTypingStatus(false);
          }, 1500);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off("user_typing");
      };
    }
  }, [selectedUser, socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleTyping = () => {
    if (selectedUser && socket && newMessage.length) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  const onProfileClick = () => {
    navigate(`/profile/${selectedUser?._id}`);
  };

  const toggleMinimize = () => {
    setIsMinimized((prevState) => !prevState);
  };

  const updateNewMessage = (newMessage: string) => {
    setNewMessage(newMessage);
  };

  const updateTypingStatus = (status: boolean) => {
    setIsTyping(status);
  };

  return {
    newMessage,
    updateNewMessage,
    isMinimized,
    toggleMinimize,
    onSendMessage: handleSend,
    handleTyping,
    onProfileClick,
    messagesEndRef,
    isTyping,
  };
};

export default useChatPopup;
