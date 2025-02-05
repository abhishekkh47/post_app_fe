import React, { useState, useRef, useEffect } from "react";
import { User, Message } from "../../types";
import { Send, Image, ArrowLeft } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import { useNavigate } from "react-router-dom";

interface ChatWindowProps {
  selectedUser: User | null;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onSendMessage: (content: string, attachments?: string[]) => void;
  onBackButtonClick: () => void;
  className?: string;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedUser,
  messages,
  setMessages,
  onSendMessage,
  onBackButtonClick,
  className,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();
  const navigate = useNavigate();

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
  }, [selectedUser, socket, messages]);

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
    // return (
    //   <div className="flex-1 flex items-center justify-center bg-gray-50">
    //     <p className="text-gray-500">Select a conversation to start chatting</p>
    //   </div>
    // );
  }

  const onProfileClick = () => {
    navigate(`/profile/${selectedUser._id}`);
  };

  return (
    <div className={className}>
      <div className="flex-1 flex flex-col h-full opacity-100 bg-white">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={() => onBackButtonClick()}
            >
              <ArrowLeft className="text-xl font-semibold" />
            </button>
            {selectedUser.profile_pic ? (
              <img
                src={selectedUser.profile_pic}
                alt={`${selectedUser.firstName} ${selectedUser.lastName}`}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200" />
            )}
            <div onClick={onProfileClick} className="cursor-pointer">
              <h3 className="font-medium">
                {selectedUser.firstName} {selectedUser.lastName}
              </h3>
            </div>
          </div>
        </div>

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
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.senderId._id === selectedUser._id
                    ? "bg-gray-100"
                    : "bg-blue-500 text-white"
                }`}
              >
                <p>{message.content}</p>
                {message.attachments?.map((attachment, i) => (
                  <img
                    key={i}
                    src={attachment}
                    alt="attachment"
                    className="mt-2 rounded-lg max-w-full"
                  />
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Image className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-2 text-blue-500 hover:text-blue-700 transition-colors disabled:text-gray-400"
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
