import React from "react";
import { Post } from "../../types";
import { PostCard } from "./";

interface PostListProps {
  posts: Post[];
  fetchPosts: () => void;
  fromHomePage?: boolean;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  fetchPosts,
  fromHomePage,
}) => {
  return (
    <div className="space-y-4">
      {/* List all posts */}
      {posts.map((post) => (
        <PostCard
          key={post._id}
          post={post}
          fetchPosts={fetchPosts}
          fromHomePage={fromHomePage || false}
        />
      ))}
    </div>
  );
};

export default PostList;
