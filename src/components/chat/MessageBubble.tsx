import React from "react";
import { Check, CheckCheck } from "lucide-react";

interface MessageProps {
  message: any;
  selectedUser: any;
  user: any;
}

export const MessageBubble: React.FC<MessageProps> = ({
  message,
  selectedUser,
  user,
}) => {
  return (
    <div
      className={`max-w-[70%] rounded-lg p-2 ${
        message.senderId._id === selectedUser._id
          ? "bg-gray-100"
          : "bg-blue-500 text-white"
      }`}
    >
      {/* use 'flex-inline' to get wrap text */}
      <div className="flex-inline">
        <span className="break-words whitespace-pre-wrap pr-2">
          {message.content}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[10px] flex-shrink-0 ${
            message.senderId._id === selectedUser._id
              ? "text-gray-500"
              : "text-gray-200"
          }`}
        >
          <span>{message.createdAt.substring(11, 16)}</span>
          {message.senderId._id === user?._id && (
            <span>
              {message.isRead ? (
                <CheckCheck className="w-3 h-3" />
              ) : (
                <Check className="w-3 h-3" />
              )}
            </span>
          )}
        </span>
      </div>
      {message.attachments?.map((attachment: any, i: any) => (
        <img
          key={i}
          src={attachment}
          alt="attachment"
          className="mt-2 rounded-lg max-w-full"
        />
      ))}
    </div>
  );
};
