import React, { useState, useEffect } from "react";
import { Message, User } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ChatPopup } from "../chat/ChatPopup";
import { useSocket } from "../../context/SocketContext";
import { MessageSquare } from "lucide-react";

export const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]); // Store messages
  const { user } = useAuth();
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Fetch data based on selected tab
  useEffect(() => {
    fetchFriends(activeTab);
  }, [activeTab]);

  const fetchFriends = async (type: "followers" | "following") => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/follow/${type}/${user?._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const obj = (await response.json())?.data;
      const data = type == "followers" ? obj?.followers : obj?.following;
      setFriends(data?.users || []);
    } catch (error) {
      console.error("Error fetching friends:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendClick = async (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleMessageClick = async (friend: User, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigation to profile
    setSelectedUser(friend);

    // Fetch messages for the selected user
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/chat/messages/${friend._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = (await response.json())?.data;
      setMessages(data.messages || []);

      // Mark messages as read
      if (socket) {
        socket.emit("mark_read", {
          receiverId: friend._id,
        });
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle sending messages
  const handleSendMessage = (content: string, attachments?: string[]) => {
    if (!socket || !selectedUser) return;

    const newMessage: Message = {
      _id: Date.now().toString(), // You can generate this dynamically or use the server's ID
      senderId: user!, // Assuming 'user' is the logged-in user
      receiverId: selectedUser, // The selected user is the receiver
      content,
      isRead: false, // Initially the message is not read
      attachments,
      createdAt: new Date().toISOString(), // Use ISO string for proper date format
    };

    // Update the messages state immediately with the new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    socket.emit("private_message", {
      receiverId: selectedUser._id,
      content,
      attachments,
    });
  };

  // Function to close chat popup
  const handleCloseChat = () => {
    setSelectedUser(null);
    setMessages([]);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Friends List
      </h1> */}
      {/* <div className="max-w-2xl mx-auto mt-8"> */}
      {/* Toggle Buttons */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === "followers"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === "following"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => setActiveTab("following")}
        >
          Following
        </button>
      </div>

      {/* Friends List */}
      <div className="mt-6">
        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : friends.length > 0 ? (
          <ul className="space-y-3">
            {friends.map((friend) => (
              <li
                key={friend._id}
                className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow"
                onClick={() => handleFriendClick(friend._id)}
              >
                <img
                  src={friend.profile_pic}
                  alt={friend.firstName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <span className="flex-1 font-medium text-gray-800">
                  {friend.firstName} {friend.lastName}
                </span>
                <button
                  onClick={(e) => {
                    handleMessageClick(friend, e);
                  }} // Open chat popup on "Message"
                  className="ml-auto text-blue-500 hover:text-blue-700"
                >
                  <MessageSquare className="w50 h5" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No friends found.</p>
        )}
      </div>
      {/* Conditionally render the ChatPopup if a friend is selected */}
      {selectedUser && (
        <ChatPopup
          selectedUser={selectedUser}
          messages={messages}
          setMessages={setMessages}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChat}
        />
      )}
      {/* </div> */}
    </div>
  );
};
