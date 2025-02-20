import React from "react";
import { Comment } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";
import { CommentService } from "../../services";

interface CommentListProps {
  comments: Comment[];
  onCommentDelete: () => void;
}

export const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentDelete,
}) => {
  const { user } = useAuth();

  const handleDeleteComment = async (commentId: string) => {
    try {
      await CommentService.deleteComment(commentId);
      onCommentDelete();
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment?._id} className="flex items-start space-x-3">
          {comment?.userId?.profile_pic ? (
            <img
              src={comment?.userId?.profile_pic}
              alt={`${comment?.userId?.firstName} ${comment?.userId?.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200" />
          )}
          <div className="flex-1 bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="font-medium">
                {comment?.userId?.firstName} {comment?.userId?.lastName}
              </p>
              {user?._id === comment?.userId?._id && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <p className="text-gray-800">{comment?.content}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(comment?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
