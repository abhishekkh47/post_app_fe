import React, { useEffect } from "react";
import { Send } from "lucide-react";
import { useCreatePost } from "../../hooks";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";

interface CreatePostProps {
  fetchPosts: () => void;
}

const CreatePostV2: React.FC<CreatePostProps> = ({ fetchPosts }) => {
  const { content, error, updateContent, handleSubmit } = useCreatePost({
    fetchPosts,
  });
  const placeholder = "What's on your mind?";
  const { quill, quillRef } = useQuill({ placeholder });

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        updateContent(quillRef.current.firstChild.innerHTML);
      });
    }
  }, [quill]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
    // quillRef.current.firstChild.innerHTML = "";

    if (quill) {
      quill.root.innerHTML = "";
      updateContent("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <form onSubmit={handlePostSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex items-start space-x-4">
          {/* <div style={{ width: 500, height: 300 }}> */}
          <div className="w-full h-auto">
            <div ref={quillRef} />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostV2;
