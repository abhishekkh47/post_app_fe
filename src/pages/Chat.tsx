import React, { useState, useEffect } from "react";
import { ChatList } from "../components/chat/ChatList";
import { ChatWindow } from "../components/chat/ChatWindow";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation } from "../types";

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    // Fetch conversations
    fetch(`${import.meta.env.VITE_API_URL}/chat/conversations`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setConversations(data.conversations));
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: Message) => {
      setMessages((prev) => [...prev, message]);
      // Update conversations list
      setConversations((prev) =>
        prev.map((conv) =>
          conv.userDetails._id === message.senderId._id
            ? { ...conv, lastMessage: message }
            : conv
        )
      );
    });

    socket.on("message_sent", (message: Message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new_message");
      socket.off("message_sent");
    };
  }, [socket]);

  const handleSelectConversation = async (user: User) => {
    setSelectedUser(user);
    // Fetch messages for selected conversation
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/chat/messages/${user._id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = (await response.json())?.data;
    setMessages(data.messages);
  };

  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!socket || !selectedUser) return;

    socket.emit("private_message", {
      receiverId: selectedUser._id,
      content,
      attachments,
    });
  };

  return (
    <div className="h-screen flex">
      <ChatList
        conversations={conversations}
        selectedUser={selectedUser}
        onSelectConversation={handleSelectConversation}
      />
      <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};
