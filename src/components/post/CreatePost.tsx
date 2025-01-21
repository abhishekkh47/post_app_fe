import React, { useState } from "react";
import { Send } from "lucide-react";

export const CreatePost: React.FC = () => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/post/create-post`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ post: content }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      setContent("");
    } catch (err) {
      setError("Failed to create post. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex items-start space-x-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
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
