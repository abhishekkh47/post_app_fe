import React from "react";
import { Send } from "lucide-react";
import { useCreateComment } from "../../hooks";

interface CreateCommentProps {
  postId: string;
  onCommentAdded: (added: boolean) => void;
  commentId?: string;
}

const CreateComment: React.FC<CreateCommentProps> = ({
  postId,
  onCommentAdded,
  commentId,
}) => {
  const { content, handleSubmit, updateNewComment } = useCreateComment({
    postId,
    onCommentAdded,
    commentId,
  });

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={content}
          onChange={(e) => updateNewComment(e.target.value)}
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

export default CreateComment;
