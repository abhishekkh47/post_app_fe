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
    <div className="max-w-2xl mx-auto py-8 px-4 mt-16">
      {loading ? (
        <Loader />
      ) : (
        <>
          <FriendsList
            friends={friends}
            selectedUser={selectedUser}
            messages={messages}
            activeTab={activeTab}
            updateActiveTab={updateActiveTab}
            updateMessages={updateMessages}
            handleFriendClick={handleFriendClick}
            handleMessageClick={handleMessageClick}
            handleSendMessage={handleSendMessage}
            handleCloseChat={handleCloseChat}
            selectedGroup={selectedGroup}
          />
          {friendSuggestions?.length && (
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
