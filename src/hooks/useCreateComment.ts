import { useState } from "react";
import { CommentService } from "../services";
import { Comment } from "../types";

interface CommentProps {
  postId: string;
  onCommentAdded: (comment: Comment) => void;
}

const useCreateComment = ({ postId, onCommentAdded }: CommentProps) => {
  const [content, setContent] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await CommentService.createComment(postId, content);
      onCommentAdded(data.comment);
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
