import React, { useEffect, useRef, useState } from "react";
import { Send, Smile } from "lucide-react";
import { useCreatePost } from "../../hooks";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface CreatePostProps {
  fetchPosts: () => void;
}

const CreatePostV2: React.FC<CreatePostProps> = ({ fetchPosts }) => {
  const { content, error, updateContent, handleSubmit } = useCreatePost({
    fetchPosts,
  });
  const placeholder = "What's on your mind?";

  // Custom toolbar configuration
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["image"],
    ],
  };

  const { quill, quillRef } = useQuill({
    placeholder,
    modules,
    theme: "snow",
  });

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // State for emoji picker
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // State to track input focus and content
  const [isFocused, setIsFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  // Handle click outside of emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const text = quillRef.current.firstChild.textContent || "";
        updateContent(quillRef.current.firstChild.innerHTML);
        setCharCount(text.trim().length);
        if (
          !quill.getText() ||
          quill.getText() == "" ||
          quill.getText().length == 1
        ) {
          updateContent("");
        }
      });
    }
  }, [quill]);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    if (quill) {
      const range = quill.getSelection(true);
      quill.insertText(range.index, emojiData.emoji);
      quill.setSelection(range.index + emojiData.emoji.length, 0);
    }
    setShowEmojiPicker(false);
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);

    if (quill) {
      quill.root.innerHTML = "";
      updateContent("");
      setCharCount(0);
    }
  };

  return (
    <div
      className={`
      bg-white rounded-lg shadow-md p-4 mb-4 transition-all duration-300 
      ${isFocused ? "ring-2 ring-blue-500" : "ring-0"}
    `}
    >
      <form onSubmit={handlePostSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div
          className="w-full h-auto mb-3"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        >
          <div
            ref={quillRef}
            className="min-h-[100px] max-h-[300px] overflow-y-auto"
          />
        </div>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute z-50">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}

        {/* Character Counter and Post Button Container */}
        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-blue-500"
            >
              <Smile className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-500">
              {charCount}/{MAX_CHARS} characters
            </div>
          </div>
          <button
            type="submit"
            disabled={!content.trim() || charCount > MAX_CHARS}
            className={`
              inline-flex items-center px-4 py-2 border border-transparent 
              text-sm font-medium rounded-md shadow-sm text-white 
              bg-blue-600 hover:bg-blue-700 focus:outline-none 
              focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-300
            `}
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostV2;
