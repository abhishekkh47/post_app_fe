import React from "react";
import { CreatePostV2 } from "../post";
import { X } from "lucide-react";
import { usePostFeed } from "../../hooks";

interface CreatePostProps {
  handleCancelPost: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ handleCancelPost }) => {
  const { fetchPosts } = usePostFeed();
  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleCancelPost} // Close modal when clicking outside
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button
          onClick={handleCancelPost}
          className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        <CreatePostV2 fetchPosts={fetchPosts} />
      </div>
    </div>
  );
};

export default CreatePost;
