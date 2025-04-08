import React, { useEffect } from "react";
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
import { DeleteAccount } from "../dialog";
import { CONFIRM_DELETE } from "../../utils";
import DOMPurify from "dompurify";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { ProfilePicture } from "../profile";

interface PostCardProps {
  post: Post;
  fetchPosts: () => void;
  fromHomePage: boolean;
  editingActive: string | null;
  updateEditingActive?: (postId: string | null) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  fetchPosts,
  fromHomePage,
  editingActive,
  updateEditingActive,
}) => {
  const { user } = useAuth();
  const {
    showComments,
    isEditing,
    comments,
    reaction,
    openConfirmationModal,
    getComments,
    handleCommentClick,
    handleDelete,
    checkUpdatedPost,
    getPostsIfUpdated,
    updateIsEditing,
    updateReaction,
    updateConfirmationModal,
    deletedComment,
  } = usePostCard({ post, fetchPosts, updateEditingActive });

  const sanitizedContent = DOMPurify.sanitize(post.post);

  const { quill, quillRef } = useQuill({
    placeholder: "Edit your post...",
  });

  useEffect(() => {
    if (quill && post.post) {
      quill.root.innerHTML = post.post;
      quill.on("text-change", () => {
        checkUpdatedPost(quillRef?.current?.firstChild?.innerHTML);
      });
    }
  }, [quill, post.post]);

  const handleSaveEdit = () => {
    updateIsEditing(false);
    getPostsIfUpdated();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <ProfilePicture
            profile_pic={
              user?._id === post?.userId?._id
                ? user.profile_pic
                : post?.userId?.profile_pic
            }
            firstName={post?.userId?.firstName || ""}
            size={10}
            text={`lg`}
          />
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
            {user?._id === post?.userId?._id &&
            editingActive == post._id &&
            isEditing ? (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveEdit}
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
            ) : !editingActive ? (
              user?._id === post?.userId?._id && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateIsEditing(true, post._id)}
                    className="hover:text-green-500"
                  >
                    <PencilIcon className="relative h-5 w-5" />
                  </button>
                  <button
                    onClick={updateConfirmationModal}
                    className="hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              )
            ) : (
              ""
            )}
          </div>
        )}
      </div>

      {/* open text box to edit the content */}
      {isEditing ? (
        <div ref={quillRef} className="w-full h-36" />
      ) : (
        <div
          className="text-gray-800 mb-4"
          dangerouslySetInnerHTML={{ __html: sanitizedContent }} // Render HTML content
        />
      )}

      {/* Like and comment icons */}
      <div className="flex items-center space-x-4 text-gray-500">
        <button
          className="flex items-center space-x-1 hover:text-blue-500"
          onClick={() => updateReaction(post._id, reaction.status)}
        >
          <Heart
            className={`h-5 w-5 ${reaction.status ? "fill-red-500" : ""}`}
          />
          <span>{reaction.count}</span>
        </button>
        <button
          // onClick={() => setShowComments(!showComments)}
          onClick={handleCommentClick}
          className="flex items-center space-x-1 hover:text-blue-500"
        >
          <MessageCircle className="h-5 w-5" />
          <span>{comments.count}</span>
        </button>
      </div>

      {/* Show post comments */}
      {showComments && (
        <div className="mt-4">
          <CreateComment
            post={post}
            // onCommentAdded={handleCommentAdded}
            onCommentAdded={getComments}
          />
          <CommentList
            post={post}
            comments={comments.commentList}
            onCommentDelete={deletedComment}
          />
        </div>
      )}
      {/* confirmation modal to delete comment */}
      {openConfirmationModal && (
        <DeleteAccount
          open={openConfirmationModal}
          handleOpen={updateConfirmationModal}
          deleteHandler={handleDelete}
          type={CONFIRM_DELETE.POST}
        />
      )}
    </div>
  );
};

export default PostCard;
