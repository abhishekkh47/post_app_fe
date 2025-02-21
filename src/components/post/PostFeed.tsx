import React from "react";
import { CreatePost } from "./CreatePost";
import { PostList } from "./PostList";
import { usePostFeed } from "../../hooks";

export const PostFeed: React.FC = () => {
  const { posts, loading, error, fetchPosts } = usePostFeed();

  return (
    <div>
      <CreatePost fetchPosts={fetchPosts} />
      {loading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <PostList posts={posts} fetchPosts={fetchPosts} fromHomePage={true} />
      )}
    </div>
  );
};
