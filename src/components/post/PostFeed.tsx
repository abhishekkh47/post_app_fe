import React from "react";
import { CreatePostV2, PostList } from "./";
import { usePostFeed } from "../../hooks";

const PostFeed: React.FC = () => {
  const { posts, loading, error, fetchPosts } = usePostFeed();

  return (
    <div>
      {/* <CreatePost fetchPosts={fetchPosts} /> */}
      <CreatePostV2 fetchPosts={fetchPosts} />
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

export default PostFeed;
