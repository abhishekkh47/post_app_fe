import React from "react";
import {
  Home,
  User,
  Users,
  MessageSquare,
  Compass,
  //   Bell,
  Settings,
  //   LogOut,
  PlusSquare,
} from "react-feather";
import { useAuth } from "../../context/AuthContext";
import { CreatePost as CreatePostDialog } from "../dialog";
import { ProfilePicture } from "../profile";
import { NavLink } from "react-router-dom";

interface LeftPanelProps {
  showCreatePostModal: boolean;
  handleCancelPost: () => void;
  openCreatePostModal: () => void;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  showCreatePostModal,
  handleCancelPost,
  openCreatePostModal,
}) => {
  const { user } = useAuth();

  if (!user) return null;

  const navItems = [
    { icon: <Home size={20} />, label: "Home", path: "/" },
    {
      icon: <User size={20} />,
      label: "Profile",
      path: `/profile/${user._id}`,
    },
    { icon: <Users size={20} />, label: "Friends", path: "/friends" },
    { icon: <MessageSquare size={20} />, label: "Chats", path: "/messages" },
    { icon: <Compass size={20} />, label: "Explore", path: "/explore" },
    // {
    //   icon: <Bell size={20} />,
    //   label: "Notifications",
    //   path: "/notifications",
    // },
    { icon: <Settings size={20} />, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* User Profile Section */}
      <div className="p-4 flex items-center space-x-3 border-b border-gray-200">
        <ProfilePicture
          profile_pic={user.profile_pic}
          firstName={user.firstName}
          size={10}
        />
        <div>
          <p className="font-medium">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-500">@{user.firstName}</p>
        </div>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-2">
        <button
          onClick={openCreatePostModal}
          className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors mx-2 rounded-lg"
        >
          <PlusSquare size={20} className="text-blue-500" />
          <span className="font-medium">Create Post</span>
        </button>

        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end
            className={({ isActive }) =>
              classNames(
                isActive ? "text-blue-500" : "",
                "flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors mx-2 rounded-lg"
              )
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Bottom Section - Logout */}
      {/* <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-100 transition-colors rounded-lg text-red-500"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div> */}

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostDialog handleCancelPost={handleCancelPost} />
      )}
    </div>
  );
};

export default LeftPanel;
