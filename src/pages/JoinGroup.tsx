import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { GroupChatService } from "../services";
import { useJoinGroup } from "../context/JoinGroupContext";

const JoinGroup: React.FC = () => {
  const { user } = useAuth();
  const { inviteToken } = useParams<{ inviteToken: string }>();
  const { updateJoinGroupData } = useJoinGroup();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !inviteToken) {
      setError("Invalid request");
      return;
    }

    const getGroupDetails = async () => {
      try {
        const groupData = (
          await GroupChatService.getGroupDetailsUsingInviteLink(inviteToken)
        )?.group;
        updateJoinGroupData(groupData);
        if (groupData && inviteToken) {
          navigate(`/?inviteToken=${inviteToken}`);
        }
      } catch (error) {
        setError(`Invalid Group Invite: ${(error as Error).message}`);
      }
    };
    getGroupDetails();
  }, [user, inviteToken, navigate, updateJoinGroupData]);

  if (error) {
    return (
      <div className="max-w-full">
        <div className="flex-1">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-full">
      <div className="flex-1">Redirecting...</div>
    </div>
  );
};

export default JoinGroup;
