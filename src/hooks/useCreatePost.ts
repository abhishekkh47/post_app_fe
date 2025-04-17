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
  const [attachments, setAttachments] = useState<File[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [showAttachmentPanel, setShowAttachmentPanel] =
    useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [charCount, setCharCount] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let attachmentNames: string[] = [];
    if (content) {
      try {
        if (attachmentNames.length > 10) {
          alert("You can only upload upto 10 attachments");
          return false;
        }
        await PostService.createPost(content, attachments);
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

  const updateAttachments = (files: File[]) => {
    setAttachments([...attachments, ...files]);
  };

  const updateShowEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const updateShowAttachmentPanel = () => {
    setShowAttachmentPanel(!showAttachmentPanel);
  };

  const updateIsFocused = () => {
    setIsFocused(!isFocused);
  };

  const updateCharCount = (count: number) => {
    setCharCount(count);
  };

  return {
    content,
    error,
    updateContent,
    handleSubmit,
    attachments,
    updateAttachments,
    showEmojiPicker,
    updateShowEmojiPicker,
    showAttachmentPanel,
    updateShowAttachmentPanel,
    isFocused,
    updateIsFocused,
    charCount,
    updateCharCount,
  };
};

export default useCreatePost;
