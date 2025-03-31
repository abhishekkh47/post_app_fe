import { useState } from "react";
import { CommentService } from "../services";
import { Comment } from "../types";

interface CommentCardProps {
  comment: Comment;
  onCommentDelete: () => void;
  postId: string;
  userId?: string;
}

const useCommentCard = ({
  onCommentDelete,
  comment,
  postId,
  userId,
}: CommentCardProps) => {
  const [reaction, setReaction] = useState<{ status: boolean; count: number }>({
    status: comment?.likedBy?.includes(userId || "") || false,
    count: comment?.likedBy?.length || 0,
  });

  const handleDeleteComment = async (commentId: string) => {
    try {
      await CommentService.deleteComment(commentId);
      onCommentDelete();
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  const likeOrDislikeComment = async (commentId: string) => {
    try {
      await CommentService.likeOrDislikeComment(
        commentId,
        postId,
        !reaction.status
      );
      setReaction({
        status: !reaction.status,
        count: !reaction.status ? reaction.count + 1 : reaction.count - 1,
      });
    } catch (err) {
      console.error((err as Error).message);
    }
  };

  return { reaction, handleDeleteComment, likeOrDislikeComment };
};

export default useCommentCard;
