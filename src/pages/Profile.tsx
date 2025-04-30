import React from "react";
import { UserProfile, ProfileFeed } from "../components/profile";
import { useParams } from "react-router-dom";
import { useFriends, useProfile } from "../hooks";
import { FriendsList } from "../components/friends";
import { Tab } from "../types";
import { Loader } from "../components/common";

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const {
    isFollowing,
    isPublicProfile,
    user,
    profile,
    handleFollow,
    updateUser,
    activeTab,
    updateActiveTab: updateActiveTabProfile,
  } = useProfile({ userId });

  const {
    friends,
    loading,
    selectedUser,
    messages,
    updateMessages,
    handleFriendClick,
    handleMessageClick,
    handleSendMessage,
    handleCloseChat,
    selectedGroup,
    updateActiveTab: updateActiveTabFriends,
  } = useFriends();

  const setActiveTab = (tab: Tab) => {
    updateActiveTabProfile(tab);
    updateActiveTabFriends(tab);
  };

  if (!userId) {
    return <div>User Not Found ...</div>;
  }

  return (
    <div className="w-full lg:pl-48 xl:pl-72 2xl:pl-96 lg:pr-48 xl:pr-72 2xl:pr-96 transition-all duration-300">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <UserProfile
          user={user}
          profile={profile}
          isFollowing={isFollowing}
          handleFollow={handleFollow}
          updateUser={updateUser}
        />
        <div className="flex flex-col py-8">
          <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md font-semibold transition w-1/3 ${
                activeTab === "posts"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => updateActiveTabProfile("posts")}
            >
              Posts
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition w-1/3 ${
                activeTab === "followers"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("followers")}
            >
              Followers
            </button>
            <button
              className={`px-4 py-2 rounded-md font-semibold transition w-1/3 ${
                activeTab === "following"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab("following")}
            >
              Following
            </button>
          </div>
          {activeTab == "posts" ? (
            (profile?._id === userId || isPublicProfile || isFollowing) && (
              <div className="py-6">
                <ProfileFeed userId={userId} />
              </div>
            )
          ) : loading ? (
            <Loader />
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
