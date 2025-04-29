import React from "react";
import { Check, CheckCheck } from "lucide-react";
import { ProfilePicture } from "../profile";
import { Message, User } from "../../types";

interface MessageProps {
  message: Message;
  user: User | null;
}

const MessageBubble: React.FC<MessageProps> = ({ message, user }) => {
  return (
    <>
      {/* Profile Image */}
      <div className="flex items-center justify-between rounded-t-lg">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          // onClick={user ? onProfileClick : onGroupClick}
        >
          {message && message?.senderId?._id !== user?._id ? (
            <ProfilePicture
              profile_pic={message?.senderId?.profile_pic}
              firstName={message?.senderId?.firstName || ""}
              size={6}
              text={`lg`}
            />
          ) : null}
        </div>
      </div>
      <div
        className={`max-w-[70%] rounded-lg p-2 m-1 ${
          // message.senderId._id === selectedUser?._id ||
          message.senderId._id !== user?._id
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
              // message.senderId._id === selectedUser?._id ||
              message.senderId._id !== user?._id
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
            loading="lazy"
            className="mt-2 rounded-lg max-w-full"
          />
        ))}
      </div>
    </>
  );
};

export default MessageBubble;
