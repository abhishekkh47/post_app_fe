import { useState } from "react";
import { CommentService, PostService } from "../services";
import { Post, Comment } from "../types";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
}

const usePostCard = ({ post, fetchPosts }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.post);
  const [ifUpdated, setIfUpdated] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  //   const { user } = useAuth();

  const getComments = async () => {
    try {
      const data = await CommentService.getPostComments(post._id);
      setComments(data.comments);
    } catch (err) {
      console.error("Failed to get comments:", err);
    }
  };

  const handleCommentClick = () => {
    setShowComments(!showComments);
    if (!showComments) {
      getComments();
    }
  };

  const handleDelete = async () => {
    try {
      await PostService.deletePost(post._id);
      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      await PostService.updatePost(post._id, updatedContent);
      setIsEditing(false);
      setIfUpdated(false);
      fetchPosts();
    } catch (err) {
      console.error("Failed to update post:", err);
    }
  };

  // update the post content and close text box
  const checkUpdatedPost = (data: string) => {
    if (updatedContent != data) {
      setUpdatedContent(data);
      setIfUpdated(true);
    }
  };

  // refresh posts once the content is updated
  const getPostsIfUpdated = () => {
    if (ifUpdated) handleUpdate();
    setIsEditing(false);
  };

  const updateIsEditing = (bool: boolean) => {
    setIsEditing(bool);
  };

  return {
    showComments,
    isEditing,
    comments,
    updatedContent,
    getComments,
    handleCommentClick,
    handleDelete,
    handleUpdate,
    checkUpdatedPost,
    getPostsIfUpdated,
    updateIsEditing,
  };
};

export default usePostCard;
