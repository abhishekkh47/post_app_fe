import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation } from "../types";
import { ChatService } from "../services";
import { WS_EVENTS } from "../utils";

const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();
  const {
    CHAT: {
      LISTENER: { MESSAGE_MARKED_READ, MESSAGE_SENT, NEW_MESSAGE },
      EMITTER: { PRIVATE_MSG, MARK_READ },
    },
  } = WS_EVENTS;

  useEffect(() => {
    // Fetch conversations
    ChatService.getConversations().then((data) =>
      setConversations(data.conversations)
    );
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    const handleMessage = async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      // Update conversations list
      await handleNewMessage(message);
    };

    const handleMarkReadMessages = async () => {
      updateMessagesReadStatus();
      await handleNewMessage();
    };

    socket.on(NEW_MESSAGE, handleMessage);
    socket.on(MESSAGE_SENT, handleMessage);
    socket.on(MESSAGE_MARKED_READ, handleMarkReadMessages);

    return () => {
      socket.off(NEW_MESSAGE);
      socket.off(MESSAGE_SENT);
      socket.off(MESSAGE_MARKED_READ);
    };
  }, [socket, messages]);

  const handleNewMessage = async (message: Message | null = null) => {
    ChatService.getConversations().then((data) =>
      setConversations(data.conversations)
    );
    if (
      socket &&
      message &&
      selectedUser?._id == message.senderId._id &&
      !message.isRead
    ) {
      handleSelectConversation(selectedUser);
    }
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
    setMessages(data.messages);

    await handleNewMessage();

    if (!socket || !user) return;
    socket.emit(MARK_READ, {
      receiverId: user._id,
    });
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!socket || !selectedUser) return;

    socket.emit(PRIVATE_MSG, {
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
