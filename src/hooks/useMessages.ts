import { useState, useRef, useEffect } from "react";
import { Message } from "../types";

const useMessages = (selectedUser: any, socket: any) => {
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen for incoming messages from the WebSocket server
  useEffect(() => {
    if (socket) {
      socket.on("new_message", (newMessage: Message) => {
        if (selectedUser && newMessage.senderId._id === selectedUser._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
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

  const handleTyping = () => {
    if (selectedUser && socket) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  const updateNewMessage = (message: string) => {
    setNewMessage(message);
  };

  return {
    messages,
    setMessages,
    messagesEndRef,
    handleTyping,
    newMessage,
    updateNewMessage,
  };
};

export default useMessages;
