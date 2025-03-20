import { useState, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { User, Message, Conversation, Group } from "../types";
import { ChatService, GroupChatService } from "../services";
import { CHAT_TYPE, WS_EVENTS } from "../utils";

const useChat = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[] | any>([]);
  const {
    socket,
    sendPrivateMessage,
    markAsRead,
    sendGroupMessage,
    markGroupMessageAsRead,
  } = useSocket();
  const {
    CHAT: {
      LISTENER: { MESSAGE_MARKED_READ, MESSAGE_SENT, NEW_MESSAGE },
      // EMITTER: { PRIVATE_MSG, MARK_READ },
    },
    GROUP: {
      LISTENER: {
        GROUP_MESSAGE_MARKED_READ,
        GROUP_NEW_MESSAGE,
        GROUP_MESSAGE_SENT,
      },
      // EMITTER: { GROUP_MSG, GROUP_MARK_READ },
    },
  } = WS_EVENTS;

  useEffect(() => {
    // Fetch conversations
    ChatService.getConversations().then((data) => {
      setConversations(data.conversations);
      setGroups(data.groupConversations);
    });
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.connect();

    const handleMessage = async (message: Message | any) => {
      setMessages((prev: any) => {
        if (prev.some((m: any) => m._id === message._id)) {
          return prev;
        }
        return [...prev, message];
      });
      // Update conversations list
      await handleNewMessage(message);
    };
    const handleGroupMessage = async (group: Group | any) => {
      setMessages((prev: any) => {
        if (prev.some((m: any) => m._id === group._id)) {
          return prev;
        }
        return [...prev, group];
      });
      // Update conversations list
      await handleNewGroupMessage(group);
    };

    const handleMarkReadMessages = async () => {
      updateMessagesReadStatus();
      await handleNewMessage();
    };
    const handleMarkReadGroupMessages = async () => {
      updateMessagesReadStatus();
      await handleNewGroupMessage();
    };

    socket.on(NEW_MESSAGE, handleMessage);
    socket.on(MESSAGE_SENT, handleMessage);
    socket.on(GROUP_NEW_MESSAGE, handleGroupMessage);
    socket.on(MESSAGE_MARKED_READ, handleMarkReadMessages);
    socket.on(GROUP_MESSAGE_MARKED_READ, handleMarkReadGroupMessages);
    socket.on(GROUP_MESSAGE_SENT, handleMarkReadMessages);

    return () => {
      socket.off(NEW_MESSAGE);
      socket.off(MESSAGE_SENT);
      socket.off(MESSAGE_MARKED_READ);
      socket.off(GROUP_NEW_MESSAGE);
      socket.off(GROUP_MESSAGE_SENT);
      socket.off(GROUP_MESSAGE_MARKED_READ);
    };
  }, [socket, messages]);

  const handleNewMessage = async (message: Message | null = null) => {
    ChatService.getConversations().then((data) => {
      setConversations(data.conversations);
      setGroups(data.groupConversations);
    });
    if (
      socket &&
      message &&
      selectedUser &&
      selectedUser?._id == message?.senderId?._id &&
      !message.isRead
    ) {
      handleSelectConversation(selectedUser);
    }
  };
  const handleNewGroupMessage = async (group: Group | null = null) => {
    ChatService.getConversations().then((data) => {
      setConversations(data.conversations);
      setGroups(data.groupConversations);
    });
    if (socket && group && selectedGroup) {
      handleSelectGroupChat(selectedGroup);
    }
  };

  // Update messages when they are marked as read
  const updateMessagesReadStatus = () => {
    setMessages((prevMessages: any) =>
      prevMessages.map((message: any) => ({
        ...message,
        isRead: true,
      }))
    );
  };

  const handleSelectConversation = async (user: User) => {
    setSelectedGroup(null);
    setSelectedUser(user);
    // Fetch messages for selected conversation
    const data = await ChatService.getMessages(user._id);
    setMessages(data.messages);

    await handleNewMessage();

    if (!socket || !user) return;
    markAsRead(user._id);
  };

  const handleCloseChat = () => {
    setSelectedUser(null);
    setSelectedGroup(null);
    setMessages([]);
  };

  const handleSendMessage = (
    content: string,
    attachments: string[] = [],
    type: string = CHAT_TYPE.INDIVIDUAL
  ) => {
    if (!socket || (!selectedUser && !selectedGroup)) return;

    if (type === CHAT_TYPE.INDIVIDUAL && selectedUser) {
      sendPrivateMessage(selectedUser._id, content, attachments);
    } else if (type === CHAT_TYPE.GROUP && selectedGroup) {
      sendGroupMessage(selectedGroup._id, content, attachments);
    }
  };

  const updateMessages = (newMessage: Message) => {
    setMessages((prevMessages: any) => [...prevMessages, newMessage]);
  };

  const handleSelectGroupChat = async (group: Group) => {
    setSelectedUser(null);
    setSelectedGroup(group);
    const data = (await GroupChatService.getGroupMessages(group._id))?.messages;
    setMessages(data);

    const messageLength = data?.length;
    await handleNewMessage();

    if (!socket || !group) return;
    markGroupMessageAsRead(group._id, data[messageLength - 1]?._id);
  };

  const updateSelectedUser = (user: User | null) => {
    setSelectedUser(user);
  };

  const newGroupCreated = () => {
    ChatService.getConversations().then((data) => {
      setConversations(data.conversations);
      setGroups(data.groupConversations);
    });
  };

  return {
    conversations,
    groups,
    selectedUser,
    messages,
    selectedGroup,
    handleSelectConversation,
    handleCloseChat,
    handleSendMessage,
    updateMessages,
    handleSelectGroupChat,
    updateSelectedUser,
    newGroupCreated,
  };
};

export default useChat;
