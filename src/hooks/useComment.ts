import { useState } from "react";
import { CommentService } from "../services";

const useComment = (onCommentAdded: (arg0: any) => void, postId: string) => {
  const [comment, setComment] = useState<string>("");

  const updateComment = (comment: string) => {
    setComment(comment);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await CommentService.createComment(postId, comment);
      onCommentAdded(data.comment);
      setComment("");
    } catch (err) {
      console.error(`Failed to comment: ${err}`);
    }
  };

  return { comment, updateComment, handleSubmit };
};

export default useComment;
