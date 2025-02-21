import { useEffect, useState } from "react";
import { Post } from "../types";
import { PostService } from "../services";

const usePostFeed = () => {
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

  return { posts, loading, error, fetchPosts };
};

export default usePostFeed;
