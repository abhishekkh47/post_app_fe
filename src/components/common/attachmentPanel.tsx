// components/AttachmentPanel.tsx
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, VideoIcon } from "lucide-react";

interface AttachmentPanelProps {
  onFilesAdded: (files: File[]) => void;
}

const AttachmentPanel: React.FC<AttachmentPanelProps> = ({ onFilesAdded }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesAdded(acceptedFiles);
    },
    [onFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
      // "application/pdf": [".pdf"],
    },
  });

  return (
    <div
      className="mt-3 p-4 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50 transition-all"
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      <div className="text-center text-gray-500">
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <ImageIcon className="text-blue-400 w-6 h-6" />
            <VideoIcon className="text-red-400 w-6 h-6" />
            <p>Drag & drop images or videos here, or click to select files</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttachmentPanel;
