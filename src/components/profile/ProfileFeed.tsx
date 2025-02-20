import React, { useEffect, useState } from "react";
import { Post } from "../../types";
import { PostList } from "../post/PostList";
import { PostService } from "../../services";

interface ProfileFeedProps {
  userId: string | undefined;
}

export const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await PostService.fetchPostsByUser(userId);
      setPosts(data.posts);
    } catch (err) {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

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
