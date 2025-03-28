import React from "react";
import { Comment } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Trash2 } from "lucide-react";
import { useCommentList } from "../../hooks";
import { ProfilePicture } from "../profile";

interface CommentListProps {
  comments: Comment[];
  onCommentDelete: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onCommentDelete,
}) => {
  const { user } = useAuth();
  const { handleDeleteComment } = useCommentList({ onCommentDelete });

  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment?._id} className="flex items-start space-x-3">
          <ProfilePicture
            profile_pic={comment?.userId?.profile_pic}
            firstName={comment?.userId?.firstName || ""}
            size={8}
            text={`lg`}
            className="cursor-pointer"
          />
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

export default CommentList;
