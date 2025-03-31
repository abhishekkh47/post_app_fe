import { useState } from "react";
import { CommentService } from "../services";

interface CommentProps {
  postId: string;
  onCommentAdded: (added: boolean) => void;
  commentId?: string;
}

const useCreateComment = ({
  postId,
  onCommentAdded,
  commentId,
}: CommentProps) => {
  const [content, setContent] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CommentService.createComment(postId, content, commentId);
      onCommentAdded(true);
      setContent("");
    } catch (err) {
      console.error(`Failed to comment: ${err}`);
    }
  };

  const updateNewComment = (content: string) => {
    setContent(content);
  };

  return { content, handleSubmit, updateNewComment };
};

export default useCreateComment;
