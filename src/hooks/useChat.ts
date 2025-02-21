import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation } from "../types";
import { ChatService } from "../services";

const useChat = () => {
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

  const updateMessages = (newMessage: Message) => {
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return {
    conversations,
    selectedUser,
    messages,
    handleSelectConversation,
    handleCloseChat,
    handleSendMessage,
    updateMessages,
  };
};

export default useChat;
