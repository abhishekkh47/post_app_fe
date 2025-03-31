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
  const [showNestedComments, setShowNestedComments] = useState<boolean>(false);
  const [reaction, setReaction] = useState<{ status: boolean; count: number }>({
    status: comment?.likedBy?.includes(userId || "") || false,
    count: comment?.likedBy?.length || 0,
  });
  const [nestedComments, setNestedComments] = useState<{
    commentList: Comment[];
    count: number;
  }>({
    commentList: comment?.childComments || [],
    count: comment?.childComments?.length || 0,
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

  const getNestedComments = async (added: boolean = false) => {
    try {
      const data = await CommentService.getNestedComments(comment._id);
      setNestedComments({
        commentList: data?.comments?.childComments,
        count:
          added && nestedComments.count > 0
            ? (nestedComments.count += 1)
            : nestedComments.count,
      });
    } catch (err) {
      console.error("Failed to get comments:", err);
    }
  };

  const handleCommentReplyClick = async () => {
    setShowNestedComments(!showNestedComments);
    if (!showNestedComments) {
      getNestedComments();
    }
  };

  const deletedNestedComment = async () => {
    try {
      const data = await CommentService.getNestedComments(comment._id);
      setNestedComments({
        commentList: data?.comments?.childComments,
        count: nestedComments.count > 0 ? (nestedComments.count -= 1) : 0,
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return {
    nestedComments,
    reaction,
    showNestedComments,
    handleDeleteComment,
    likeOrDislikeComment,
    handleCommentReplyClick,
    getNestedComments,
    deletedNestedComment,
  };
};

export default useCommentCard;
