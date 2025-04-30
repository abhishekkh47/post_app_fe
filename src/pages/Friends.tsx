import React from "react";
import { FriendsList, FriendSuggestions } from "../components/friends";
import { useFriends } from "../hooks";
import { Loader } from "../components/common";

const Friends: React.FC = () => {
  const {
    friends,
    friendSuggestions,
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
      {loading ? (
        <Loader />
      ) : (
        <>
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
          <FriendsList
            friends={friends}
            selectedUser={selectedUser}
            messages={messages}
            updateMessages={updateMessages}
            handleFriendClick={handleFriendClick}
            handleMessageClick={handleMessageClick}
            handleSendMessage={handleSendMessage}
            handleCloseChat={handleCloseChat}
            selectedGroup={selectedGroup}
          />
          {friendSuggestions?.length > 0 && (
            <>
              <h1 className="text-xl text-gray-900 text-start mt-6">
                People you may know
              </h1>
              <FriendSuggestions
                friendSuggestions={friendSuggestions}
                handleFriendClick={handleFriendClick}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Friends;
