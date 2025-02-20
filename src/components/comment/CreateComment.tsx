import React, { useState } from "react";
import { Send } from "lucide-react";
import { Comment } from "../../types";
import { CommentService } from "../../services";

interface CreateCommentProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

export const CreateComment: React.FC<CreateCommentProps> = ({
  postId,
  onCommentAdded,
}) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await CommentService.createComment(postId, content);
      onCommentAdded(data.comment);
      setContent("");
    } catch (err) {
      console.error(`Failed to comment: ${err}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
