import React from "react";
import { Comment, Post } from "../../types";
import CommentCard from "./CommentCard";

interface CommentListProps {
  post: Post;
  comments: Comment[];
  onCommentDelete: () => void;
  isNested?: boolean;
}

const CommentList: React.FC<CommentListProps> = ({
  post,
  comments,
  onCommentDelete,
  isNested = false,
}) => {
  return (
    <div className="space-y-4 mt-4">
      {comments?.map((comment) => (
        <div key={comment?._id}>
          <CommentCard
            post={post}
            comment={comment}
            onCommentDelete={onCommentDelete}
            isNested={isNested || false}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentList;
