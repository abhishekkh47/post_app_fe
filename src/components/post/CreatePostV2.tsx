// components/CreatePostV2.tsx
import React, { useEffect, useRef } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import { useQuill } from "react-quilljs";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import "quill/dist/quill.snow.css";
import { AttachmentPanel } from "../common";
import { useCreatePost } from "../../hooks";

interface CreatePostProps {
  fetchPosts: () => void;
}

const CreatePostV2: React.FC<CreatePostProps> = ({ fetchPosts }) => {
  const {
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
    charCount,
    updateCharCount,
    updateIsFocused,
    discardSelectedImage,
  } = useCreatePost({
    fetchPosts,
  });
  const placeholder = "What's on your mind?";
  const MAX_CHARS = 500;

  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      // ["image"],
    ],
  };

  const { quill, quillRef } = useQuill({
    placeholder,
    modules,
    theme: "snow",
  });

  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Emoji Picker Dismiss Logic
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        updateShowEmojiPicker();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Quill Text Change Listener
  useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        const text = quillRef.current?.firstChild?.textContent || "";
        const html = quillRef.current?.firstChild?.innerHTML || "";
        updateContent(html);
        updateCharCount(text.trim().length);

        if (!quill.getText().trim() || quill.getText().trim().length <= 1) {
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
    updateShowEmojiPicker();
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);

    if (quill) {
      quill.root.innerHTML = "";
      updateContent("");
      updateCharCount(0);
    }
    updateAttachments([]);
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-4 mb-4 relative transition-all duration-300 
        ${isFocused ? "ring-2 ring-blue-500" : "ring-0"}
      `}
    >
      <form onSubmit={handlePostSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div
          className="w-full mb-3"
          onFocus={() => updateIsFocused()}
          onBlur={() => updateIsFocused()}
        >
          <div
            ref={quillRef}
            className="min-h-[100px] max-h-[300px] overflow-y-auto"
          />
        </div>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div ref={emojiPickerRef} className="absolute z-50 mt-1">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              height={350}
              width={300}
            />
          </div>
        )}

        {/* Attachment Panel */}
        {showAttachmentPanel && (
          <AttachmentPanel
            onFilesAdded={(files) => updateAttachments([...files])}
          />
        )}

        {/* File Preview */}
        {attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="relative w-20 h-20 overflow-hidden rounded border"
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <video
                    src={URL.createObjectURL(file)}
                    className="object-cover w-full h-full"
                    controls
                  />
                )}
                <button
                  type="button"
                  onClick={() => discardSelectedImage(index)}
                  className="absolute top-1 right-1 bg-gray-700 text-white p-1 rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => updateShowEmojiPicker()}
              className="text-gray-500 hover:text-yellow-500 transition-transform hover:scale-110"
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => updateShowAttachmentPanel()}
              className="text-gray-500 hover:text-green-500 transition-transform hover:scale-110"
            >
              <Paperclip className="h-5 w-5" />
            </button>
            <div className="text-sm text-gray-500">
              {charCount}/{MAX_CHARS}
            </div>
          </div>
          <button
            type="submit"
            disabled={
              (!content?.trim() && !attachments.length) || charCount > MAX_CHARS
            }
            className={`
              inline-flex items-center px-4 py-2 text-sm font-medium rounded-md 
              shadow-sm text-white bg-blue-600 hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
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
