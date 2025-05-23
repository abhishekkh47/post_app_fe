import React, { useEffect, useState } from "react";
import { User, Users, TrendingUp, Star, ChevronRight } from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import { Group } from "../../types";
import { GroupChatService } from "../../services";
import { Loader } from "../common";
import { ProfilePicture } from "../profile";
import { useNavigate } from "react-router-dom";

interface RightPanelProps {
  trendingTopics?: Array<{
    _id: string;
    title: string;
    count: number;
  }>;
  recommendedContent?: Array<{
    _id: string;
    title: string;
    imageUrl: string;
    author: string;
  }>;
}

const RightPanel: React.FC<RightPanelProps> = ({
  trendingTopics = [],
  recommendedContent = [],
}) => {
  const { user } = useAuth();
  const { onlineUsers, isConnected, getActiveFriends } = useSocket();
  const navigate = useNavigate();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!isConnected) return;

    const timer = setTimeout(() => {
      getActiveFriends();
      fetchGroups();
    }, 3000);

    return () => clearTimeout(timer); // Clean up on unmount
  }, [isConnected]);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await GroupChatService.getGroups();
      setGroups(response.groups);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-full w-full">
      <div className="flex flex-col h-full bg-white border-l border-gray-200 max-w-full overflow-y-auto custom-scrollbar">
        {/* Friends Online Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <User size={18} className="text-green-500" />
              <h3 className="font-semibold text-gray-800">Friends Online</h3>
            </div>
            <span className="text-xs font-medium text-gray-500">
              {onlineUsers.length} online
            </span>
          </div>

          <div className="space-y-3">
            {onlineUsers.length > 0 ? (
              onlineUsers.slice(0, 5).map((friend) => (
                <div
                  key={friend._id}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="relative">
                    <ProfilePicture
                      profile_pic={friend?.profile_pic}
                      firstName={friend.firstName || ""}
                      size={8}
                      text="lg"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {friend.firstName} {friend.lastName}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No friends online</p>
            )}

            {onlineUsers.length > 5 && (
              <div className="text-sm text-blue-500 flex items-center justify-center cursor-pointer hover:underline mt-2">
                See all ({onlineUsers.length})
                <ChevronRight size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Groups Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Users size={18} className="text-purple-500" />
              <h3 className="font-semibold text-gray-800">Your Groups</h3>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <Loader />
            ) : groups.length > 0 ? (
              groups.slice(0, 3).map((group) => (
                <div
                  key={group._id}
                  className="flex items-center space-x-2 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <ProfilePicture
                    profile_pic={group?.profile_pic}
                    firstName={group.name || ""}
                    size={8}
                    text="lg"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {group.name}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                You aren't in any groups yet
              </p>
            )}

            {groups.length > 0 && (
              <div
                className="text-sm text-blue-500 flex items-center justify-center cursor-pointer hover:underline mt-2"
                onClick={() => {
                  navigate("/messages");
                }}
              >
                See all groups
                <ChevronRight size={16} />
              </div>
            )}
          </div>
        </div>

        {/* Trending Topics Section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp size={18} className="text-red-500" />
            <h3 className="font-semibold text-gray-800">Trending Topics</h3>
          </div>

          <div className="space-y-2">
            {trendingTopics.length > 0 ? (
              trendingTopics.slice(0, 5).map((topic, index) => (
                <div
                  key={topic._id}
                  className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <span className="text-sm font-medium text-gray-800">
                        {topic.title}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {topic.count}k
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No trending topics right now
              </p>
            )}
          </div>
        </div>

        {/* Recommended For You Section */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Star size={18} className="text-yellow-500" />
            <h3 className="font-semibold text-gray-800">Recommended For You</h3>
          </div>

          <div className="space-y-4">
            {recommendedContent.length > 0 ? (
              recommendedContent.slice(0, 3).map((content) => (
                <div
                  key={content._id}
                  className="hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={content.imageUrl || "/api/placeholder/60/60"}
                      alt={content.title}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-gray-800 line-clamp-2">
                        {content.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        By {content.author}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No recommendations available
              </p>
            )}

            {recommendedContent.length > 3 && (
              <div className="text-sm text-blue-500 flex items-center justify-center cursor-pointer hover:underline mt-2">
                See more recommendations
                <ChevronRight size={16} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
