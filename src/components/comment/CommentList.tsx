import React from "react";
import { Comment } from "../../types";
import CommentCard from "./CommentCard";

interface CommentListProps {
  postId: string;
  comments: Comment[];
  onCommentDelete: () => void;
}

const CommentList: React.FC<CommentListProps> = ({
  postId,
  comments,
  onCommentDelete,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment?._id}>
          <CommentCard
            postId={postId}
            comment={comment}
            onCommentDelete={onCommentDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
