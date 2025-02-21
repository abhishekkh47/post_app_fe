import React from "react";
import { User, Message } from "../../types";
import { Send, Image, Minimize2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MessageBubble } from "./MessageBubble";
import { useChatPopup } from "../../hooks";

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  updateMessages: (messages: Message) => void;
  onSendMessage: (content: string, attachments?: string[]) => void;
  onClose: () => void;
  className?: string;
}

export const ChatPopup: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  updateMessages,
  onSendMessage,
  onClose,
}) => {
  const { user } = useAuth();

  if (!selectedUser) {
    return;
  }

  const {
    newMessage,
    setNewMessage,
    isMinimized,
    toggleMinimize,
    onSendMessage: handleSend,
    handleTyping,
    onProfileClick,
    messagesEndRef,
  } = useChatPopup({
    selectedUser,
    messages,
    updateMessages,
    onSendMessage,
  });

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
              // <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="size-8 rounded-full bg-blue-300 flex items-center justify-center text-lg border border-black">
                {selectedUser?.firstName[0]}
              </div>
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
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
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
