import React, { useEffect, useState } from "react";
import { Post } from "../../types";
import { PostCard } from "./";
import { PostService } from "../../services";
import { useParams } from "react-router-dom";

const ViewPost: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const getPostDetailsById = async () => {
    try {
      if (!postId) {
        return;
      }
      let post = await PostService.getPostById(postId);
      if (post && post?.post) {
        setPost(post.post);
      }
    } catch (err) {
      console.error("Failed to fetch post:", err);
    }
  };
  useEffect(() => {
    getPostDetailsById();
  }, [postId]);
  const fetchPosts = () => {
    return;
  };
  return (
    // <div className="space-y-4">
    <div className="max-w-4xl mx-auto py-8 px-4 mt-16">
      {/* List all posts */}
      {post && (
        <PostCard
          key={post._id}
          post={post}
          fetchPosts={fetchPosts}
          fromHomePage={false}
          editingActive={null}
        />
      )}
    </div>
  );
};

export default ViewPost;
