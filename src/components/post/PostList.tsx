import React from "react";
import { Post } from "../../types";
import { PostCard } from "./PostCard";

interface PostListProps {
  posts: Post[];
  fetchPosts: () => void;
  fromHomePage?: boolean;
}

export const PostList: React.FC<PostListProps> = ({
  posts,
  fetchPosts,
  fromHomePage,
}) => {
  return (
    <div className="space-y-4">
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
