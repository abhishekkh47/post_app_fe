import React, { useEffect, useState } from "react";
import { Post } from "../../types";
import { CreatePost } from "./CreatePost";
import { PostList } from "./PostList";

export const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/post/get-feed`,
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
      <CreatePost fetchPosts={fetchPosts} />
      {loading ? (
        <div className="text-center py-4">Loading posts...</div>
      ) : error ? (
        <div className="text-red-500 text-center py-4">{error}</div>
      ) : (
        <PostList posts={posts} fetchPosts={fetchPosts} fromHomePage={true} />
      )}
    </div>
  );
};
