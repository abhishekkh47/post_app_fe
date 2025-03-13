import { useEffect, useRef, useState } from "react";
import { Group, Message, User } from "../types";
import { useSocket } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { WS_EVENTS } from "../utils";

interface UseChatProps {
  selectedUser: User | null;
  selectedGroup: Group | null;
  messages: Message[];
  updateMessages: (newMessage: Message) => void;
  onSendMessage: (content: string, attachments?: string[]) => void;
}

const useChatPopup = ({
  selectedUser,
  selectedGroup,
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

  const {
    CHAT: {
      LISTENER: { NEW_MESSAGE, USER_TYPING },
      EMITTER: { TYPING },
    },
  } = WS_EVENTS;

  // Listen for incoming messages from the WebSocket server
  useEffect(() => {
    if (socket) {
      socket.on(NEW_MESSAGE, (newMessage: Message) => {
        if (selectedUser && newMessage.senderId._id === selectedUser._id) {
          updateMessages(newMessage);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off(NEW_MESSAGE);
      };
    }
  }, [selectedUser, socket]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (socket) {
      socket.on(USER_TYPING, (data: { userId: string }) => {
        if (selectedUser?._id == data.userId) {
          updateTypingStatus(true);

          setTimeout(() => {
            updateTypingStatus(false);
          }, 1500);
        }
      });

      // Cleanup when the component unmounts or the socket changes
      return () => {
        socket.off(USER_TYPING);
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
      socket.emit(TYPING, { receiverId: selectedUser._id });
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
