import { useState } from "react";
import { CommentService, PostService } from "../services";
import { Post, Comment } from "../types";
import { useAuth } from "../context/AuthContext";

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
  const [reaction, setReaction] = useState<boolean>(false);
  const { updateUser } = useAuth();

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
      updateUser();
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

  const updateReaction = async (postId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      await PostService.likePost(postId);
    } else {
      await PostService.dislikePost(postId);
    }
    setReaction(!reaction);
  };

  return {
    showComments,
    isEditing,
    comments,
    updatedContent,
    reaction,
    getComments,
    handleCommentClick,
    handleDelete,
    handleUpdate,
    checkUpdatedPost,
    getPostsIfUpdated,
    updateIsEditing,
    updateReaction,
  };
};

export default usePostCard;
