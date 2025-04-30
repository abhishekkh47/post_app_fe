import React, { useState } from "react";

interface PostListProps {
  attachments: string[];
}

const RenderAttachment: React.FC<PostListProps> = ({ attachments }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  //   const renderAttachments = () => {
  if (!attachments || attachments.length === 0) return null;

  const renderSingleAttachment = (attachmentUrl: string) => {
    const fileExtension = attachmentUrl.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif", "webp"].includes(fileExtension || "")) {
      return (
        <img
          src={attachmentUrl}
          alt="Post attachment"
          className="w-full h-auto max-h-96 object-contain rounded-lg bg-gray-100"
          onClick={() => window.open(attachmentUrl, "_blank")}
        />
      );
    } else if (["mp4", "webm", "ogg"].includes(fileExtension || "")) {
      return (
        <video controls className="w-full h-auto max-h-96 rounded-lg bg-black">
          <source src={attachmentUrl} type={`video/${fileExtension}`} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      // For other file types (PDFs, docs, etc.)
      return (
        <div className="p-4 border rounded-lg bg-gray-50 flex items-center">
          <a
            href={attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline flex items-center"
          >
            <svg
              className="w-6 h-6 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Download Attachment
          </a>
        </div>
      );
    }
  };

  return (
    <div className="mt-4 rounded-lg overflow-hidden pb-4">
      {attachments.length === 1 ? (
        renderSingleAttachment(attachments[0])
      ) : (
        <div className="relative">
          {/* Main attachment display */}
          {renderSingleAttachment(attachments[activeImageIndex])}

          {/* Navigation arrows for multiple attachments */}
          {attachments.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveImageIndex(
                    (prev) =>
                      (prev - 1 + attachments.length) % attachments.length
                  )
                }
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                &lt;
              </button>
              <button
                onClick={() =>
                  setActiveImageIndex((prev) => (prev + 1) % attachments.length)
                }
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
              >
                &gt;
              </button>
            </>
          )}

          {/* Attachment indicators (dots) */}
          {attachments.length > 1 && (
            <div className="flex justify-center mt-2 space-x-2">
              {attachments.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    index === activeImageIndex ? "bg-blue-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
  //   };
};

export default RenderAttachment;
