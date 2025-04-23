import React from "react";
import { FriendSuggestions } from "../components/friends";

const Explore: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4 mt-16">
      {/* Toggle Buttons */}
      <div className="flex space-x-2">
        <button
          className={`px-4 py-2 rounded-md font-semibold transition bg-indigo-600 text-white`}
        >
          Accounts
        </button>
      </div>

      {/* Friends List */}
      <FriendSuggestions />
    </div>
  );
};

export default Explore;
