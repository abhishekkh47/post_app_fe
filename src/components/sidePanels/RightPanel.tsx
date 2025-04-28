// RightPanel.tsx
import React from "react";
import { CreatePost as CreatePostDialog } from "../dialog";

interface RightPanelProps {
  fetchPosts: () => void;
  showCreatePostModal: boolean;
  handleCancelPost: () => void;
  openCreatePostModal: () => void;
}

const RightPanel: React.FC<RightPanelProps> = ({
  fetchPosts,
  showCreatePostModal,
  handleCancelPost,
  openCreatePostModal,
}) => {
  return (
    <div className="relative w-full h-full">
      {/* Floating Create Post Button */}
      <button
        className="fixed top-20 right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-10 md:px-6 md:py-3 md:w-auto md:h-auto w-14 h-14 flex items-center justify-center"
        onClick={openCreatePostModal}
      >
        <span className="hidden md:inline">➕ Create Post</span>
        <span className="md:hidden text-xl">➕</span>
      </button>

      {/* Modal */}
      {showCreatePostModal && (
        <CreatePostDialog
          fetchPosts={fetchPosts}
          handleCancelPost={handleCancelPost}
        />
      )}

      {/* Panel Content */}
      <div className="bg-white shadow-xl rounded-lg p-4 w-full h-full overflow-y-auto border-l border-gray-200 transition-all duration-300 ease-in-out">
        <h2 className="text-xl font-semibold text-gray-800">Right Panel</h2>
        {/* Add content here */}
      </div>
    </div>
  );
};

export default RightPanel;
