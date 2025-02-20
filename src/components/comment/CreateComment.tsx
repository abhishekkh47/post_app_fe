import React from "react";
import { Send } from "lucide-react";
import { Comment } from "../../types";
import { useComment } from "../../hooks";

interface CreateCommentProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

export const CreateComment: React.FC<CreateCommentProps> = ({
  postId,
  onCommentAdded,
}) => {
  const { comment, updateComment, handleSubmit } = useComment(
    onCommentAdded,
    postId
  );

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={comment}
          onChange={(e) => updateComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className="p-2 text-blue-500 hover:text-blue-600 disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};
