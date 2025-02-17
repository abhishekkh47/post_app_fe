import React, { useState, useEffect } from "react";
import { User } from "../../types";
import { useAuth } from "../../context/AuthContext";

export const Friends: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"followers" | "following">(
    "followers"
  );
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

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

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      {/* <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
        Friends List
      </h1> */}
      <div className="max-w-2xl mx-auto mt-8">
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
                >
                  <img
                    src={friend.profile_pic}
                    alt={friend.firstName}
                    className="w-12 h-12 rounded-full"
                  />
                  <span className="font-medium text-gray-800">
                    {friend.firstName} {friend.lastName}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No friends found.</p>
          )}
        </div>
      </div>
    </div>
  );
};
