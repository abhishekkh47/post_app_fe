import React, { useEffect, useState } from "react";
import { Post } from "../../types";
import { PostList } from "../post/PostList";

interface ProfileFeedProps {
  userId: string | undefined;
}

export const ProfileFeed: React.FC<ProfileFeedProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const endpoint = userId
        ? `get-posts-by-user/${userId.toString()}`
        : `get-my-posts`;
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/post/${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = (await response.json())?.data;
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
