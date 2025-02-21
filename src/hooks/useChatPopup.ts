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
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
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
    if (selectedUser && socket) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  const onProfileClick = () => {
    navigate(`/profile/${selectedUser?._id}`);
  };

  const toggleMinimize = () => {
    setIsMinimized((prevState) => !prevState);
  };

  return {
    newMessage,
    setNewMessage,
    isMinimized,
    toggleMinimize,
    onSendMessage: handleSend,
    handleTyping,
    onProfileClick,
    messagesEndRef,
  };
};

export default useChatPopup;
