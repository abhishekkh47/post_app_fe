import React from "react";
import { CreatePost } from "../components/post/CreatePost";
import { PostList } from "../components/post/PostList";

export const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <CreatePost />
      <PostList />
    </div>
  );
};
