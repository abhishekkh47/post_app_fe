import React from "react";
import config from "../../config";

interface ProfilePictureProps {
  profile_pic?: string | null;
  firstName: string;
  size?: number;
  text?: string;
  className?: string;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  profile_pic,
  firstName,
  size = 10,
  text = "lg",
  className,
}) => {
  return (
    <div>
      {profile_pic ? (
        <img
          src={`${config.API_URL}/uploads/${profile_pic}`}
          alt={`${firstName}`}
          loading="lazy"
          className={`h-${size} w-${size} rounded-full object-cover`}
        />
      ) : (
        // <div className="h-10 w-10 rounded-full bg-gray-200" />
        <div
          className={`h-${size} w-${size} rounded-full bg-blue-300 flex items-center justify-center text-${text} border border-black  ${
            className ? className : ""
          }`}
        >
          {firstName[0]?.toUpperCase()}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
