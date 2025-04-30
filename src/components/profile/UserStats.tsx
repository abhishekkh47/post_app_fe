import React from "react";
import { User } from "../../types";
import { useNavigate } from "react-router-dom";

interface UserStatsProps {
  profile: User;
}

const UserStats: React.FC<UserStatsProps> = ({ profile }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row">
      <div className="flex flex-col pr-4">
        <p className="relative">posts</p>
        <p className="relative">{profile?.posts ?? 0}</p>
      </div>
      <div className="flex flex-col px-4" onClick={() => navigate(`/friends`)}>
        <p className="relative">followers</p>
        <p className="relative">{profile?.followers ?? 0}</p>
      </div>
      <div className="flex flex-col px-4" onClick={() => navigate(`/friends`)}>
        <p className="relative">following</p>
        <p className="relative">{profile?.following ?? 0}</p>
      </div>
    </div>
  );
};

export default UserStats;
