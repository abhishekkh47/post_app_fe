import React from "react";
import { PostList } from "../post/PostList";
import { useProfileFeed } from "../../hooks";

interface ProfileFeedProps {
  userId: string | undefined;
}

export const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId }) => {
  const { posts, loading, error, fetchPosts } = useProfileFeed({ userId });

  return (
    <div>
      {loading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <PostList posts={posts} fetchPosts={fetchPosts} />
      )}
    </div>
  );
};
