import React, { useEffect, useRef, useState } from "react";
import { User, Message } from "../../types";
import { Send, Image, Minimize2, X } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { MessageBubble } from "./MessageBubble";

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onSendMessage: (content: string, attachments?: string[]) => void;
  onClose: () => void;
  className?: string;
}

export const ChatPopup: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  setMessages,
  onSendMessage,
  onClose,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage);
      setNewMessage("");
    }
  };

  const handleTyping = () => {
    if (selectedUser && socket) {
      socket.emit("typing", { receiverId: selectedUser._id });
    }
  };

  if (!selectedUser) {
    return;
  }

  const onProfileClick = () => {
    navigate(`/profile/${selectedUser._id}`);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className={`fixed bottom-4 right-4 z-50 `}>
      <div
        className={`bg-white rounded-lg shadow-lg w-80 transition-all duration-300 ease-in-out ${
          isMinimized ? "h-12" : "h-[500px]"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-lg">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={onProfileClick}
          >
            {selectedUser.profile_pic ? (
              <img
                src={selectedUser.profile_pic}
                alt={selectedUser.firstName[0]}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200" />
            )}
            <span className="font-medium text-sm">
              {selectedUser.firstName} {selectedUser.lastName}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleMinimize}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <Minimize2 className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Message */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId._id === selectedUser._id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <MessageBubble
                    message={message}
                    selectedUser={selectedUser}
                    user={user}
                  />
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-gray-200"
            >
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <Image className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 text-sm rounded-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors disabled:text-gray-400"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
