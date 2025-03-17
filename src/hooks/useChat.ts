import { useState, useEffect, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation, Group } from "../types";
import { ChatService, GroupChatService } from "../services";
import { CHAT_TYPE, WS_EVENTS } from "../utils";

const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { socket } = useSocket();

  const {
    CHAT: {
      LISTENER: { MESSAGE_MARKED_READ, MESSAGE_SENT, NEW_MESSAGE },
      EMITTER: { PRIVATE_MSG, MARK_READ },
    },
    GROUP: {
      LISTENER: {
        GROUP_MESSAGE_MARKED_READ,
        GROUP_NEW_MESSAGE,
        GROUP_MESSAGE_SENT,
      },
      EMITTER: { GROUP_MSG, GROUP_MARK_READ },
    },
  } = WS_EVENTS;

  // Fetch conversations function
  const fetchConversations = useCallback(async () => {
    try {
      const data = await ChatService.getConversations();
      setConversations(data.conversations);
      setGroups(data.groupConversations);
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    }
  }, []);

  // Initial fetch of conversations
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Update messages when they are marked as read
  const updateMessagesReadStatus = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((message) => ({
        ...message,
        isRead: true,
      }))
    );
  }, []);

  // Handle new message and refresh conversation list
  const handleNewMessage = useCallback(
    async (message: Message | null = null) => {
      await fetchConversations();

      if (
        socket &&
        message &&
        selectedUser &&
        selectedUser._id === message?.senderId?._id &&
        !message.isRead
      ) {
        handleSelectConversation(selectedUser);
      } else if (socket && selectedGroup) {
        handleSelectGroupChat(selectedGroup);
      }
    },
    [socket, selectedUser, selectedGroup]
  );

  // Handle new group message
  const handleNewGroupMessage = useCallback(
    async (message: Message | null = null) => {
      await fetchConversations();

      if (socket && message && selectedGroup) {
        handleSelectGroupChat(selectedGroup);
      }
    },
    [socket, selectedGroup]
  );

  // Handle select conversation
  const handleSelectConversation = useCallback(
    async (user: User) => {
      setSelectedGroup(null);
      setSelectedUser(user);

      try {
        const data = await ChatService.getMessages(user._id);
        setMessages(data.messages);

        if (socket && user) {
          socket.emit(MARK_READ, {
            receiverId: user._id,
          });
        }

        await fetchConversations();
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    },
    [socket, fetchConversations]
  );

  // Handle select group chat
  const handleSelectGroupChat = useCallback(
    async (group: Group) => {
      setSelectedUser(null);
      setSelectedGroup(group);

      try {
        const data = await GroupChatService.getGroupMessages(group._id);
        const groupMessages = data?.messages || [];
        setMessages(groupMessages);

        const messageLength = groupMessages.length;

        if (socket && group && messageLength > 0) {
          socket.emit(GROUP_MARK_READ, {
            groupId: group._id,
            messageId: groupMessages[messageLength - 1]?._id,
          });
        }

        await fetchConversations();
      } catch (error) {
        console.error("Failed to fetch group messages:", error);
      }
    },
    [socket, fetchConversations, GROUP_MARK_READ]
  );

  // Handle close chat
  const handleCloseChat = useCallback(() => {
    setSelectedUser(null);
    setSelectedGroup(null);
    setMessages([]);
  }, []);

  // Handle send message
  const handleSendMessage = useCallback(
    (
      content: string,
      attachments?: string[],
      type: string = CHAT_TYPE.INDIVIDUAL
    ) => {
      if (!socket || (!selectedUser && !selectedGroup)) return;

      if (type === CHAT_TYPE.INDIVIDUAL && selectedUser) {
        socket.emit(PRIVATE_MSG, {
          receiverId: selectedUser._id,
          content,
          attachments,
        });
      } else if (type === CHAT_TYPE.GROUP && selectedGroup) {
        socket.emit(GROUP_MSG, {
          groupId: selectedGroup._id,
          content,
          attachments,
        });
      }
    },
    [socket, selectedUser, selectedGroup, PRIVATE_MSG, GROUP_MSG]
  );

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.connect();

    const handleIncomingMessage = async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      await handleNewMessage(message);
    };

    const handleIncomingGroupMessage = async (message: Message) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      await handleNewGroupMessage(message);
    };

    const handleMessagesRead = async () => {
      updateMessagesReadStatus();
      await handleNewMessage();
    };

    socket.on(NEW_MESSAGE, handleIncomingMessage);
    socket.on(MESSAGE_SENT, handleIncomingMessage);
    socket.on(GROUP_NEW_MESSAGE, handleIncomingGroupMessage);
    socket.on(MESSAGE_MARKED_READ, handleMessagesRead);
    socket.on(GROUP_MESSAGE_MARKED_READ, handleMessagesRead);
    socket.on(GROUP_MESSAGE_SENT, handleMessagesRead);

    return () => {
      socket.off(NEW_MESSAGE, handleIncomingMessage);
      socket.off(MESSAGE_SENT, handleIncomingMessage);
      socket.off(GROUP_NEW_MESSAGE, handleIncomingGroupMessage);
      socket.off(MESSAGE_MARKED_READ, handleMessagesRead);
      socket.off(GROUP_MESSAGE_MARKED_READ, handleMessagesRead);
      socket.off(GROUP_MESSAGE_SENT, handleMessagesRead);
    };
  }, [
    socket,
    handleNewMessage,
    handleNewGroupMessage,
    updateMessagesReadStatus,
  ]);

  return {
    conversations,
    groups,
    selectedUser,
    messages,
    selectedGroup,
    handleSelectConversation,
    handleCloseChat,
    handleSendMessage,
    updateMessages: (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    },
    handleSelectGroupChat,
    updateSelectedUser: setSelectedUser,
  };
};

export default useChat;
