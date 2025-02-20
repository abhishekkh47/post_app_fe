import React, { useState, useEffect } from "react";
import { ChatList } from "../components/chat/ChatList";
// import { ChatWindow } from "../components/chat/ChatWindow";
import { ChatPopup } from "../components/chat/ChatPopup";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation } from "../types";
import { ChatService } from "../services";

export const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    // Fetch conversations
    ChatService.getConversations().then((data) =>
      setConversations(data.conversations)
    );
  }, []);

  const handleNewMessage = async () => {
    ChatService.getConversations().then((data) =>
      setConversations(data.conversations)
    );
  };

  // Update messages when they are marked as read
  const updateMessagesReadStatus = () => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => ({
        ...message,
        isRead: true,
      }))
    );
  };

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    socket.on("new_message", async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      // Update conversations list
      await handleNewMessage();
    });

    socket.on("message_sent", async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
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
      updateMessagesReadStatus();
      await handleNewMessage();
    });

    return () => {
      socket.off("message_marked_read");
    };
  }, [socket, messages]);

  const handleSelectConversation = async (user: User) => {
    setSelectedUser(user);
    // Fetch messages for selected conversation
    const data = await ChatService.getMessages(user._id);
    console.log("data : ", data);
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
