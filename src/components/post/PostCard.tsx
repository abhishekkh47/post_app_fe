import React from "react";
import { Post } from "../../types";
import {
  MessageCircle,
  Heart,
  Trash2,
  PencilIcon,
  Check,
  X,
} from "lucide-react";
import { CommentList, CreateComment } from "../comment";
import { usePostCard } from "../../hooks";
import { useAuth } from "../../context/AuthContext";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
  fromHomePage: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  fetchPosts,
  fromHomePage,
}) => {
  const { user } = useAuth();
  const {
    showComments,
    isEditing,
    comments,
    updatedContent,
    getComments,
    handleCommentClick,
    handleDelete,
    checkUpdatedPost,
    getPostsIfUpdated,
    updateIsEditing,
  } = usePostCard({ post, fetchPosts });

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
            // <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center text-lg border border-black">
              {post?.userId?.firstName[0]?.toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">
              {post?.userId?.firstName} {post?.userId?.lastName}
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
                  onClick={() => updateIsEditing(false)}
                  className="hover:text-green-500"
                >
                  <X className="relative h-5 w-5" />
                </button>
              </div>
            ) : (
              user?._id === post?.userId?._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateIsEditing(true)}
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

export default PostCard;
