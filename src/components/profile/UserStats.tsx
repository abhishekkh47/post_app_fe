import React from "react";
import { User } from "../../types";

interface UserStatsProps {
  profile: User;
}

export const UserStats: React.FC<UserStatsProps> = ({ profile }) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col pr-4">
        <p className="relative">posts</p>
        <p className="relative">{profile?.posts ?? 0}</p>
      </div>
      <div className="flex flex-col px-4">
        <p className="relative">followers</p>
        <p className="relative">{profile?.followers ?? 0}</p>
      </div>
      <div className="flex flex-col px-4">
        <p className="relative">following</p>
        <p className="relative">{profile?.following ?? 0}</p>
      </div>
    </div>
  );
};
