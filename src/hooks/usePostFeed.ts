import { useEffect, useState } from "react";
import { Post } from "../types";
import { PostService } from "../services";

const usePostFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchPosts = async (reset: boolean = false) => {
    try {
      const currentPage = reset ? 1 : page;
      if (reset) {
        setLoading(true);
        setPage(1);
      }

      const data = await PostService.getFeed(currentPage);

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }
      setHasMore(data.posts.length === 10);
      if (reset) {
        setPage(1);
      }
    } catch (err) {
      setError(`${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to load more posts
  const loadMore = async () => {
    if (!hasMore || loadingMore) return;

    try {
      setLoadingMore(true);
      const nextPage = page + 1;

      const data = await PostService.getFeed(nextPage);

      if (data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
        setPage(nextPage);
      }

      // Check if there are more posts to load
      setHasMore(data.posts.length === 10);
    } catch (err) {
      setError(`${(err as Error).message}`);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, fetchPosts, loadMore, hasMore, loadingMore };
};

export default usePostFeed;
