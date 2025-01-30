import React from "react";
import { PostFeed } from "../components/post/PostFeed";

export const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PostFeed />
      {/* <PostList /> */}
    </div>
  );
};
