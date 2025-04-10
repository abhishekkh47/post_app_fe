import React from "react";
import { PostList } from "../post";
import { useProfileFeed } from "../../hooks";
import { Loader } from "../common";

interface ProfileFeedProps {
  userId: string | undefined;
}

const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId }) => {
  const {
    posts,
    loading,
    error,
    editingActive,
    updateEditingActive,
    fetchPosts,
  } = useProfileFeed({ userId });

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <PostList
          posts={posts}
          fetchPosts={fetchPosts}
          editingActive={editingActive}
          updateEditingActive={updateEditingActive}
        />
      )}
    </div>
  );
};

export default ProfileFeed;
