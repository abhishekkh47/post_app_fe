import React, { useEffect, useState } from "react";
import { Post } from "../../types";
import { CreatePost } from "./CreatePost";
import { PostList } from "./PostList";
import { PostService } from "../../services";

export const PostFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await PostService.getFeed();
      setPosts(data.posts);
    } catch (err) {
      setError(`${(err as Error).message}`);
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
