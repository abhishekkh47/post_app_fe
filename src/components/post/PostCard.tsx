import React, { useState } from "react";
import { Post, Comment } from "../../types";
import { MessageCircle, Heart, Trash2 } from "lucide-react";
import { CommentList } from "../comment/CommentList";
import { CreateComment } from "../comment/CreateComment";
import { useAuth } from "../../context/AuthContext";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, fetchPosts }) => {
  const [showComments, setShowComments] = useState(false);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {post?.userId?.profile_pic ? (
            <img
              src={post?.userId?.profile_pic}
              alt={`${post?.userId?.firstName} ${post?.userId?.lastName}`}
              className="h-10 w-10 rounded-full"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200" />
          )}
          <div>
            <p className="font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        {user?._id === post?.userId?._id && (
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-500"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        )}
      </div>

      <p className="text-gray-800 mb-4">{post.post}</p>

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

      {showComments && (
        <div className="mt-4">
          <CreateComment
            postId={post._id}
            // onCommentAdded={handleCommentAdded}
            onCommentAdded={getComments}
          />
          <CommentList comments={comments} />
        </div>
      )}
    </div>
  );
};
