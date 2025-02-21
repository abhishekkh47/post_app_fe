import React from "react";
import { PostFeed } from "../components/post";

const Feed: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <PostFeed />
      {/* <PostList /> */}
    </div>
  );
};

export default Feed;
