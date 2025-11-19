import React from "react";
import { FriendSuggestions } from "../components/friends";
import { useFriends } from "../hooks";
import { Loader } from "../components/common";

const Explore: React.FC = () => {
  const { loading, friendSuggestions, handleFriendClick } = useFriends();
  return (
    <div className="w-full h-[calc(100vh-5rem)] lg:pl-48 xl:pl-72 2xl:pl-96 lg:pr-48 xl:pr-72 2xl:pr-96 transition-all duration-300">
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto py-8 px-4">
          {loading ? (
            <Loader />
          ) : (
            <>
              {friendSuggestions?.length > 0 && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <h1 className="text-xl text-gray-900 text-start">
                      Recommended for You
                    </h1>
                    <span className="px-2 py-1 text-xs font-semibold text-purple-600 bg-purple-100 rounded-full">
                      ✨ AI Powered
                    </span>
                  </div>
                  <FriendSuggestions
                    friendSuggestions={friendSuggestions}
                    handleFriendClick={handleFriendClick}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Explore;
