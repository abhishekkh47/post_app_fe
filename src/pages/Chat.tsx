import React, { useState, useEffect } from "react";
import { ChatList } from "../components/chat/ChatList";
import { ChatWindow } from "../components/chat/ChatWindow";
import { ChatPopup } from "../components/chat/ChatPopup";
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
      .then((data) => setConversations(data.data.conversations));
  }, []);

  const handleNewMessage = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/chat/conversations`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const data = (await response.json())?.data;
    setConversations(data.conversations);
  };

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("new_message", async (message: Message) => {
      setMessages((prev) => [...prev, message]);
      // Update conversations list
      await handleNewMessage();
    });

    socket.on("message_sent", async (message: Message) => {
      setMessages((prev) => [...prev, message]);
      await handleNewMessage();
    });

    return () => {
      socket.off("new_message");
      socket.off("message_sent");
    };
  }, [socket, messages]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("messages_read", async (message: Message) => {
      setMessages((prev) => [...prev, message]);
      await handleNewMessage();
    });

    return () => {
      socket.off("messages_read");
    };
  }, [socket, messages]);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("message_marked_read", async () => {
      await handleNewMessage();
    });

    return () => {
      socket.off("message_marked_read");
    };
  }, [socket, messages]);

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
    await handleNewMessage();

    if (!socket || !user) return;
    socket.emit("mark_read", {
      receiverId: user._id,
    });
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!socket || !selectedUser) return;

    socket.emit("private_message", {
      receiverId: selectedUser._id,
      content,
      attachments,
    });
  };

  // const handleBackButtonClick = () => {
  //   setSelectedUser(null);
  //   setMessages([]);
  // };

  return (
    <div className="relative h-screen flex">
      <ChatList
        conversations={conversations}
        selectedUser={selectedUser}
        onSelectConversation={handleSelectConversation}
      />
      {/* <ChatWindow
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        onSendMessage={handleSendMessage}
        onBackButtonClick={handleBackButtonClick}
        className="absolute top-0 left-0 w-full h-full z-20"
      /> */}
      <ChatPopup
        selectedUser={selectedUser}
        messages={messages}
        setMessages={setMessages}
        onSendMessage={handleSendMessage}
        onClose={handleCloseChat}
      />
    </div>
  );
};
