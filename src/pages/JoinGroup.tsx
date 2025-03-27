import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { GroupChatService } from "../services";
import { useJoinGroup } from "../context/JoinGroupContext";

const JoinGroup: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;
  const { inviteToken } = useParams<{ inviteToken: string }>();
  if (!inviteToken) return;
  const { updateJoinGroupData } = useJoinGroup();

  const navigate = useNavigate();
  useEffect(() => {
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
        return (
          <div className="max-w-full">
            <div className="flex-1">Invalid Group Invite</div>
          </div>
        );
      }
    };
    getGroupDetails();
  });

  return (
    <div className="max-w-full">
      <div className="flex-1">Redirecting...</div>
    </div>
  );
};

export default JoinGroup;
