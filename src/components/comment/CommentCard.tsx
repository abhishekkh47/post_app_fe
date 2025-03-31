import React from "react";
import { Comment } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { Trash2, MessageCircle, Heart } from "lucide-react";
import { useCommentCard } from "../../hooks";
import { ProfilePicture } from "../profile";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

interface CommentCardProps {
  postId: string;
  comment: Comment;
  onCommentDelete: () => void;
  isNested?: boolean;
}

const CommentCard: React.FC<CommentCardProps> = ({
  postId,
  comment,
  onCommentDelete,
  isNested = false,
}) => {
  const { user } = useAuth();
  const {
    reaction,
    nestedComments,
    showNestedComments,
    handleDeleteComment,
    likeOrDislikeComment,
    handleCommentReplyClick,
    getNestedComments,
    deletedNestedComment,
  } = useCommentCard({
    onCommentDelete,
    comment,
    postId,
    userId: user?._id,
  });

  return (
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
          <div className="flex flex-row gap-x-1 place-items-center">
            <p className="font-medium">
              {comment?.userId?.firstName} {comment?.userId?.lastName}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(comment?.createdAt).toLocaleDateString()}
            </p>
          </div>
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
        {/* <p className="text-xs text-gray-500 mt-1">likes</p> */}
        <div className="flex items-center space-x-2 text-gray-500 text-xs mt-1">
          {
            <button
              className="flex items-center space-x-1 hover:text-blue-500"
              onClick={() => likeOrDislikeComment(comment._id)}
            >
              <Heart
                className={`size-4 ${reaction.status ? "fill-red-500" : ""}`}
              />
              <span>{reaction.count}</span>
            </button>
          }
          {true && (
            <button
              // onClick={() => setShowComments(!showComments)}
              onClick={handleCommentReplyClick}
              className="flex items-center space-x-1 hover:text-blue-500"
            >
              <MessageCircle className="size-4" />
              <span>{!isNested ? comment?.replies : nestedComments.count}</span>
            </button>
          )}
        </div>
        {/* Show post comments */}
        {showNestedComments && (
          <div className="mt-4">
            <CreateComment
              postId={postId}
              // onCommentAdded={handleCommentAdded}
              onCommentAdded={getNestedComments}
              commentId={comment._id}
            />
            <CommentList
              postId={postId}
              //   comments={comments.commentList}
              comments={nestedComments.commentList}
              onCommentDelete={deletedNestedComment}
              isNested={true}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentCard;
