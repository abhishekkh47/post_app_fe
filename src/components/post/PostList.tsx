import React from "react";
import { Post } from "../../types";
import { PostCard } from "./";

interface PostListProps {
  posts: Post[];
  fetchPosts: () => void;
  fromHomePage?: boolean;
  editingActive?: string | null;
  updateEditingActive?: (postId: string | null) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  fetchPosts,
  fromHomePage,
  editingActive,
  updateEditingActive,
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
          editingActive={editingActive || null}
          updateEditingActive={updateEditingActive}
        />
      ))}
    </div>
  );
};

export default PostList;
