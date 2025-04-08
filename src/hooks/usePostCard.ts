import { useState } from "react";
import { CommentService, PostService } from "../services";
import { Post, Comment } from "../types";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
  updateEditingActive?: (postId: string | null) => void;
}

const usePostCard = ({
  post,
  fetchPosts,
  updateEditingActive,
}: PostCardProps) => {
  const { likeAPost } = useSocket();

  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.post);
  const [ifUpdated, setIfUpdated] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [comments, setComments] = useState<{
    commentList: Comment[];
    count: number;
  }>({ commentList: post.commentList || [], count: post.comments || 0 });
  const [reaction, setReaction] = useState<{ status: boolean; count: number }>({
    status: post.liked,
    count: post.reactions,
  });
  const { updateUser } = useAuth();

  const getComments = async (added: boolean = false) => {
    try {
      const data = await CommentService.getPostComments(post._id);
      setComments({
        commentList: data.comments,
        count:
          added && comments.count > 0 ? (comments.count += 1) : comments.count,
      });
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

  const updateIsEditing = (bool: boolean, postId: string | null = null) => {
    setIsEditing(bool);
    updateEditingActive ? updateEditingActive(postId) : {};
    const elements = document.getElementsByClassName("ql-toolbar");
    Array.from(elements).forEach((el) => el.remove());
  };

  const updateReaction = async (postId: string, currentStatus: boolean) => {
    if (!currentStatus) {
      likeAPost(post.userId._id, postId);
      setReaction({ status: !reaction.status, count: reaction.count + 1 });
    } else {
      await PostService.dislikePost(postId);
      setReaction({ status: !reaction.status, count: reaction.count - 1 });
    }
  };

  const updateConfirmationModal = () => {
    setOpenConfirmationModal(!openConfirmationModal);
  };

  const deletedComment = async () => {
    try {
      const data = await CommentService.getPostComments(post._id);
      setComments({
        commentList: data.comments,
        count: comments.count > 0 ? (comments.count -= 1) : 0,
      });
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  return {
    showComments,
    isEditing,
    comments,
    updatedContent,
    reaction,
    openConfirmationModal,
    getComments,
    handleCommentClick,
    handleDelete,
    handleUpdate,
    checkUpdatedPost,
    getPostsIfUpdated,
    updateIsEditing,
    updateReaction,
    updateConfirmationModal,
    deletedComment,
  };
};

export default usePostCard;
