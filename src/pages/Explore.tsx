import React from "react";
import { FriendSuggestions } from "../components/friends";
import { useFriends } from "../hooks";
import { Loader } from "../components/common";

const Explore: React.FC = () => {
  const { loading, friendSuggestions, handleFriendClick } = useFriends();
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Toggle Buttons */}
          {/* <div className="flex space-x-2">
            <button
              className={`px-4 py-2 rounded-md font-semibold transition bg-indigo-600 text-white`}
            >
              Accounts
            </button>
          </div> */}

          {/* <FriendSuggestions /> */}
          {friendSuggestions?.length && (
            <>
              <h1 className="text-xl text-gray-900 text-start">
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

export default Explore;
