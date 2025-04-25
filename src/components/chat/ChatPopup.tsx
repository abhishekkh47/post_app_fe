import React from "react";
import { User, Message, Group } from "../../types";
import { Send, Image, Minimize2, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { MessageBubble } from ".";
import { useChatPopup } from "../../hooks";
import { CHAT_TYPE } from "../../utils";
import { ProfilePicture } from "../profile";

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  updateMessages: (messages: Message) => void;
  onSendMessage: (
    content: string,
    attachments?: string[],
    type?: string
  ) => void;
  onClose: () => void;
  selectedGroup: Group | null;
  className?: string;
}

const ChatPopup: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  updateMessages,
  onSendMessage,
  onClose,
  selectedGroup,
}) => {
  const { user } = useAuth();

  const {
    newMessage,
    updateNewMessage,
    isMinimized,
    toggleMinimize,
    handleSend,
    handleTyping,
    onProfileClick,
    messagesEndRef,
    isTyping,
    onGroupClick,
    fileInputRef,
    handleFileChange,
    handleUploadClick,
    imagePreview,
    discardSelectedImage,
    onCloseChatPopup,
  } = useChatPopup({
    selectedUser,
    selectedGroup,
    messages,
    updateMessages,
    onSendMessage,
    onClose,
  });

  if (!selectedUser && !selectedGroup) {
    return;
  }

  return (
    <div>
      <div
        className={`bg-white rounded-lg shadow-lg w-80 transition-all duration-300 ease-in-out ${
          isMinimized ? "h-12" : "h-[500px]"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between bg-white rounded-t-lg">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={selectedUser ? onProfileClick : onGroupClick}
          >
            {selectedUser ? (
              <ProfilePicture
                profile_pic={selectedUser?.profile_pic}
                firstName={selectedUser.firstName || ""}
                size={8}
                text={`lg`}
              />
            ) : selectedGroup ? (
              <ProfilePicture
                profile_pic={selectedGroup.profile_pic}
                firstName={selectedGroup.name || ""}
                size={8}
                text={`lg`}
              />
            ) : (
              ""
            )}
            <span className="font-medium text-sm">
              {selectedUser
                ? `${selectedUser?.firstName} ${selectedUser?.lastName}`
                : `${selectedGroup?.name}`}
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
              onClick={onCloseChatPopup}
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
                    // message.senderId._id === selectedUser?._id ||
                    message.senderId._id !== user?._id
                      ? "justify-start"
                      : "justify-end"
                  }`}
                >
                  <MessageBubble message={message} user={user} />
                </div>
              ))}
              <div ref={messagesEndRef} />
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center justify-left space-x-2 mt-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-150"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-300"></div>
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) =>
                handleSend(
                  e,
                  selectedGroup ? CHAT_TYPE.GROUP : CHAT_TYPE.INDIVIDUAL
                )
              }
              className="p-3 border-t border-gray-200"
            >
              {/* Image Preview */}
              {imagePreview.length ? (
                <div className="relative w-full max-w-full overflow-x-auto">
                  <div className="flex flex-row space-x-2 pb-2">
                    {imagePreview.map((image, index) => (
                      <div
                        key={index}
                        className="relative w-12 h-12 flex-shrink-0 cursor-pointer"
                      >
                        <img
                          src={image}
                          alt="Preview"
                          loading="lazy"
                          className="w-full h-full object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => discardSelectedImage(index)}
                          className="absolute top-0 right-0 bg-gray-700 text-white p-1 rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  className="p-1.5 text-gray-500 hover:text-gray-700 transition-colors"
                  onClick={handleUploadClick}
                >
                  <Image className="w-5 h-5" />
                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => updateNewMessage(e.target.value)}
                  onKeyDown={handleTyping}
                  placeholder="Type a message..."
                  className="flex-1 text-sm rounded-full border border-gray-300 px-3 py-1.5 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() && !imagePreview.length}
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

export default ChatPopup;
