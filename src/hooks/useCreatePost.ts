import React, { useState } from "react";
import { PostService } from "../services";
import { useAuth } from "../context/AuthContext";

interface CreatePostProps {
  fetchPosts: () => void;
}

const useCreatePost = ({ fetchPosts }: CreatePostProps) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content) {
      try {
        console.log("content  >>", content, "<<");
        await PostService.createPost(content);
        updateUser();

        setContent("");
        setError("");
        fetchPosts();
      } catch (err) {
        setError("Failed to create post. Please try again.");
      }
    }
  };

  const updateContent = (content: string) => {
    setContent(content);
  };

  return { content, error, updateContent, handleSubmit };
};

export default useCreatePost;
