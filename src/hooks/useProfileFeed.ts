import { useEffect, useState } from "react";
import { Post } from "../types";
import { PostService } from "../services";

interface ProfileFeedProps {
  userId: string | undefined;
}

const useProfileFeed = ({ userId }: ProfileFeedProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingActive, setEditingActive] = useState<string | null>(null);

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
  }, [userId]);

  const updateEditingActive = (postId: string | null) => {
    setEditingActive(postId);
  };

  return {
    posts,
    loading,
    error,
    editingActive,
    fetchPosts,
    updateEditingActive,
  };
};

export default useProfileFeed;
