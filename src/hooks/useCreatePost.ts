import React, { useState } from "react";
import { PostService } from "../services";
import { useAuth } from "../context/AuthContext";
import { ImagePreviewData } from "../types";

interface CreatePostProps {
  fetchPosts: () => void;
}

const useCreatePost = ({ fetchPosts }: CreatePostProps) => {
  const [content, setContent] = useState<string | null>(null);
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
    if (content || attachments) {
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

  const discardSelectedImage = (index: number) => {
    setAttachments((prevImages) => prevImages.filter((_, i) => i !== index));

    // Update localStorage after removing an image
    try {
      const storedData = localStorage.getItem(`post_imagePreviews}`);

      if (storedData) {
        const data: ImagePreviewData = JSON.parse(storedData);

        // Remove the image and its metadata at the specified index
        const updatedPreviews = data.imagePreviews.filter(
          (_, i) => i !== index
        );
        const updatedMetadata = data.fileMetadata.filter((_, i) => i !== index);

        if (updatedPreviews.length > 0) {
          localStorage.setItem(
            `post_imagePreviews`,
            JSON.stringify({
              ...data,
              imagePreviews: updatedPreviews,
              fileMetadata: updatedMetadata,
            })
          );
        } else {
          // Remove from localStorage if no images left
          localStorage.removeItem(`post_imagePreviews`);
        }
      }
    } catch (error) {
      console.error(
        "Error updating localStorage after discarding image:",
        error
      );
    }
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
    discardSelectedImage,
  };
};

export default useCreatePost;
