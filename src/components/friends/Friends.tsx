import React from "react";
import { ChatPopup } from "../chat";
import { MessageSquare } from "lucide-react";
import { useFriends } from "../../hooks";
import config from "../../config";

const Friends: React.FC = () => {
  const {
    friends,
    loading,
    selectedUser,
    messages,
    activeTab,
    updateActiveTab,
    updateMessages,
    handleFriendClick,
    handleMessageClick,
    handleSendMessage,
    handleCloseChat,
    selectedGroup,
  } = useFriends();

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
          onClick={() => updateActiveTab("followers")}
        >
          Followers
        </button>
        <button
          className={`px-4 py-2 rounded-md font-semibold transition ${
            activeTab === "following"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => updateActiveTab("following")}
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
                className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow cursor-pointer"
              >
                {friend?.profile_pic ? (
                  <img
                    src={`${config.API_URL}/uploads/${friend?.profile_pic}`}
                    alt={friend?.firstName[0]}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="size-12 rounded-full bg-blue-300 flex items-center justify-center text-lg border border-black">
                    {friend?.firstName[0]?.toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <span
                    className="font-medium text-gray-800"
                    onClick={() => handleFriendClick(friend._id)}
                  >
                    {friend.firstName} {friend.lastName}
                  </span>
                </div>
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
          updateMessages={updateMessages}
          onSendMessage={handleSendMessage}
          onClose={handleCloseChat}
          selectedGroup={selectedGroup}
        />
      )}
      {/* </div> */}
    </div>
  );
};

export default Friends;
