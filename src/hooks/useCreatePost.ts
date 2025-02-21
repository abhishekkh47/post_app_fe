import React, { useState } from "react";
import { PostService } from "../services";

interface CreatePostProps {
  fetchPosts: () => void;
}

const useCreatePost = ({ fetchPosts }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await PostService.createPost(content);

      setContent("");
      setError("");
      fetchPosts();
    } catch (err) {
      setError("Failed to create post. Please try again.");
    }
  };

  const updateContent = (content: string) => {
    setContent(content);
  };

  return { content, error, updateContent, handleSubmit };
};

export default useCreatePost;
