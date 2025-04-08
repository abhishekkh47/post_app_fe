import { useState } from "react";
import { CommentService } from "../services";
import { useSocket } from "../context/SocketContext";
import { Post } from "../types";

interface CommentProps {
  post: Post;
  onCommentAdded: (added: boolean) => void;
  commentId?: string;
}

const useCreateComment = ({
  post,
  onCommentAdded,
  commentId,
}: CommentProps) => {
  const { commentOnPost, replyOnComment } = useSocket();
  const [content, setContent] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await CommentService.createComment(post._id, content, commentId);
      if (commentId) {
        replyOnComment(post.userId._id, post._id, commentId, content);
      } else {
        commentOnPost(post.userId._id, post._id, content);
      }
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
