import React, { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";
import { GroupChatService } from "../../services";

interface Message {
  _id: string;
  groupId: string;
  senderId: string;
  content: string;
  attachments: string[];
  createdAt: Date;
  readBy: { userId: string; readAt: Date }[];
  sender?: {
    _id: string;
    name: string;
    avatar?: string;
  };
}

interface GroupMember {
  userId: string;
  role: string;
  joinedAt: Date;
  user?: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
}

interface Group {
  _id: string;
  name: string;
  description: string;
  avatar?: string;
  members: GroupMember[];
  createdAt: Date;
}

interface GroupChatProps {
  group: Group;
}

const GroupChat: React.FC<GroupChatProps> = ({ group }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user } = useAuth();
  if (!user) return;
  const {
    socket,
    isConnected,
    joinGroup,
    sendGroupMessage,
    notifyGroupTyping,
    markGroupMessageAsRead,
  } = useSocket();

  // Join the group chat room when component mounts
  useEffect(() => {
    if (isConnected && group._id) {
      joinGroup(group._id);

      // Fetch messages from API
      fetchGroupMessages();
    }
  }, [isConnected, group._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on("group_new_message", (message: Message) => {
      if (message.groupId === group._id) {
        setMessages((prev) => [...prev, message]);

        // Mark as read if from someone else
        if (message.senderId !== user._id) {
          markGroupMessageAsRead(group._id, message._id);
        }
      }
    });

    // Listen for typing notifications
    socket.on(
      "group_user_typing",
      (data: { groupId: string; userId: string; username: string }) => {
        if (data.groupId === group._id && data.userId !== user._id) {
          // Add user to typing set
          setTypingUsers((prev) => new Set(prev).add(data.username));

          // Clear user from typing after a delay
          setTimeout(() => {
            setTypingUsers((prev) => {
              const newSet = new Set(prev);
              newSet.delete(data.username);
              return newSet;
            });
          }, 3000);
        }
      }
    );

    // Cleanup
    return () => {
      socket.off("group_new_message");
      socket.off("group_user_typing");
    };
  }, [socket, group._id, user._id]);

  const fetchGroupMessages = async () => {
    try {
      const response = await GroupChatService.getGroupMessages(group._id);
      const data = response.messages;
      setMessages(data);

      // Mark all messages as read
      data.forEach((message: Message) => {
        if (message.senderId !== user._id) {
          markGroupMessageAsRead(group._id, message._id);
        }
      });
    } catch (error) {
      console.error("Failed to fetch group messages:", error);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (newMessage.trim() && isConnected) {
      sendGroupMessage(group._id, newMessage);
      setNewMessage("");

      // Clear typing indicator
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Send typing notification with debounce
    if (isConnected) {
      notifyGroupTyping(group._id);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        typingTimeoutRef.current = null;
      }, 3000);
    }
  };

  // Format the list of people typing
  const typingMessage = () => {
    const users = Array.from(typingUsers);
    if (users.length === 0) return null;
    if (users.length === 1) return `${users[0]} is typing...`;
    if (users.length === 2) return `${users[0]} and ${users[1]} are typing...`;
    return `${users.length} people are typing...`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold">{group.name}</h2>
        <p className="text-sm text-gray-500">{group.members.length} members</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`mb-4 ${
              message.senderId === user._id ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.senderId === user._id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.senderId !== user._id && (
                <div className="font-bold mb-1">
                  {message.sender?.name || "Unknown user"}
                </div>
              )}
              <div>{message.content}</div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(message.createdAt).toLocaleTimeString()}
              </div>
            </div>

            {message.readBy &&
              message.readBy.length > 1 &&
              message.senderId === user._id && (
                <div className="text-xs text-gray-500 mt-1">
                  Read by {message.readBy.length - 1}{" "}
                  {message.readBy.length === 2 ? "person" : "people"}
                </div>
              )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {typingUsers.size > 0 && (
        <div className="text-sm text-gray-500 italic px-4">
          {typingMessage()}
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="bg-blue-500 text-white p-2 rounded-r-lg disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default GroupChat;
