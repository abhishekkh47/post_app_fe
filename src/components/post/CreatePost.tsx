import React, { useState } from "react";
import { Send } from "lucide-react";
import { useCreatePost } from "../../hooks";
import { TextEditor } from "../common";
import { getTextWithEmojis } from "../../utils";

interface CreatePostProps {
  fetchPosts: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ fetchPosts }) => {
  const initialFormData = {
    message: "",
    selectedFile: null,
    selectedFileType: "",
    error: "",
    shareWith: "organization",
    videoUrl: "",
    showVideoInput: false,
    showFileUpload: false,
  };
  const initialFormError = {
    messageRequired: "",
    validVideoUrl: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [formError, setFormError] = useState(initialFormError);
  const [mentionIds, setMentionIds] = useState([]);
  const [employees, setEmployees] = useState([]);

  const { content, error, updateContent, handleSubmit } = useCreatePost({
    fetchPosts,
  });

  const handlePostChange = (value: any) => {
    setFormData((prevData) => ({
      ...prevData,
      message: value,
      textWithEmoji: getTextWithEmojis(value),
    }));
    updateContent(formData.message);
  };

  const handleMentionID = (mentionIds: any) => {
    setMentionIds(mentionIds);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <form onSubmit={handleSubmit}>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <div className="flex items-start space-x-4">
          <TextEditor
            handleChangeText={handlePostChange}
            error={formError.messageRequired}
            textValue={formData.message}
            handleMentionID={handleMentionID}
            employeeList={employees}
          />
          {/* <textarea
            value={content}
            onChange={(e) => updateContent(e.target.value)}
            placeholder="What's on your mind?"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          /> */}
        </div>
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={!content.trim()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
