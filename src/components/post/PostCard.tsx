import React, { useState } from "react";
import { Post, Comment } from "../../types";
import {
  MessageCircle,
  Heart,
  Trash2,
  PencilIcon,
  Check,
  X,
} from "lucide-react";
import { CommentList } from "../comment/CommentList";
import { CreateComment } from "../comment/CreateComment";
import { useAuth } from "../../context/AuthContext";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
  fromHomePage: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  fetchPosts,
  fromHomePage,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(post.post);
  const [ifUpdated, setIfUpdated] = useState(false);
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const { user } = useAuth();

  const getComments = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/comment/get-post-comments/${post._id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("No comments found");
      }
      const data = (await response.json())?.data;
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
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/post/delete-post/${post._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      fetchPosts();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/post/edit-or-update-post`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ postId: post._id, post: updatedContent }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update post");
      }

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

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {post?.userId?.profile_pic ? (
            <img
              src={post?.userId?.profile_pic}
              alt={`${post?.userId?.firstName} ${post?.userId?.lastName}`}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          )}
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}{" "}
              {post.edited && `• Edited`}
            </p>
          </div>
        </div>
        {/* Only show edit and delete icons if user is in profile section */}
        {!fromHomePage && (
          <div className="flex space-x-2">
            {user?._id === post?.userId?._id && isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={getPostsIfUpdated}
                  className="hover:text-green-500"
                >
                  <Check className="relative h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="hover:text-green-500"
                >
                  <X className="relative h-5 w-5" />
                </button>
              </div>
            ) : (
              user?._id === post?.userId?._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="hover:text-green-500"
                  >
                    <PencilIcon className="relative h-5 w-5" />
                  </button>
                  <button onClick={handleDelete} className="hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* open text box to edit the content */}
      {isEditing ? (
        <textarea
          className="w-full p-2 border rounded-md"
          value={updatedContent}
          onChange={(e) => checkUpdatedPost(e.target.value)}
        />
      ) : (
        <p className="text-gray-800 mb-4">{post.post}</p>
      )}

      {/* Like and comment icons */}
      <div className="flex items-center space-x-4 text-gray-500">
        <button className="flex items-center space-x-1 hover:text-blue-500">
          <Heart className="h-5 w-5" />
          <span>Like</span>
        </button>
        <button
          // onClick={() => setShowComments(!showComments)}
          onClick={handleCommentClick}
          className="flex items-center space-x-1 hover:text-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Comment</span>
        </button>
      </div>

      {/* Show post comments */}
      {showComments && (
        <div className="mt-4">
          <CreateComment
            postId={post._id}
            // onCommentAdded={handleCommentAdded}
            onCommentAdded={getComments}
          />
          <CommentList comments={comments} onCommentDelete={getComments} />
        </div>
      )}
    </div>
  );
};
