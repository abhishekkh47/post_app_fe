import React from "react";
import { Group, Message, User } from "../../types";
import { Send, Image, ArrowLeft } from "lucide-react";
import { MessageBubble } from ".";
import { ProfilePicture } from "../profile";
import { useChatPopup } from "../../hooks";
import { useAuth } from "../../context/AuthContext";

interface ChatMessageViewProps {
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

const ChatMessageView: React.FC<ChatMessageViewProps> = ({
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

  return (
    <div className="flex flex-col max-w-2xl mx-auto pt-2 px-4 bg-white relative h-[calc(100vh-4rem)]">
      {/* Header with fixed position */}
      <div className="sticky top-10 md:top-16 z-10 bg-white p-2 pt-0 border-b border-gray-200 flex items-center">
        <button
          onClick={onCloseChatPopup}
          className="mr-3 p-1 hover:bg-gray-100 rounded-full"
          aria-label="Back to messages"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={selectedUser ? onProfileClick : onGroupClick}
          >
            {selectedUser ? (
              <ProfilePicture
                profile_pic={selectedUser?.profile_pic}
                firstName={selectedUser.firstName || ""}
                size={10}
                text="lg"
              />
            ) : selectedGroup ? (
              <ProfilePicture
                profile_pic={selectedGroup?.profile_pic}
                firstName={selectedGroup.name || ""}
                size={10}
                text="lg"
              />
            ) : null}

            <div>
              <h2 className="font-medium">
                {selectedUser
                  ? `${selectedUser?.firstName} ${selectedUser?.lastName}`
                  : selectedGroup?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedGroup &&
                  `${selectedGroup.members?.length || 0} members`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages with flex-1 to take available space and overflow-y-auto for scrolling */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex ${
              message.senderId._id !== user?._id
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <MessageBubble message={message} user={user} />
          </div>
        ))}
        <div ref={messagesEndRef} />

        {isTyping && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-150"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-gray-400 animate-pulse delay-300"></div>
          </div>
        )}
      </div>

      {/* Input with fixed position at bottom */}
      <div className="sticky bottom-0 z-10 bg-white">
        <form onSubmit={handleSend} className="p-2 border-t border-gray-200">
          {imagePreview.length > 0 && (
            <div className="mb-2 overflow-x-auto">
              <div className="flex space-x-2">
                {imagePreview.map((image, index) => (
                  <div key={index} className="relative w-16 h-16">
                    <img
                      src={image}
                      alt="Preview"
                      className="w-full h-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => discardSelectedImage(index)}
                      className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-1"
                    >
                      <span className="sr-only">Remove</span>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleUploadClick}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <Image className="w-5 h-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />

            <input
              type="text"
              value={newMessage}
              onChange={(e) => updateNewMessage(e.target.value)}
              onKeyDown={handleTyping}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />

            <button
              type="submit"
              disabled={!newMessage.trim() && imagePreview.length === 0}
              className="p-2 text-blue-500 hover:text-blue-700 disabled:text-gray-400"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatMessageView;
