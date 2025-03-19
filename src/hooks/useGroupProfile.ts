import { useState, useEffect } from "react";
import { Group } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService, GroupChatService } from "../services";
import { useNavigate } from "react-router-dom";

interface GroupProfileProps {
  groupId: string | undefined;
}

const useGroupProfile = ({ groupId }: GroupProfileProps) => {
  const [groupProfile, setGroupProfile] = useState<Group | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [openDeleteChatDialog, setOpenDeleteChatDialog] =
    useState<boolean>(false);
  const [openLeaveGroupDialog, setOpenLeaveGroupDialog] =
    useState<boolean>(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // get user profile
  const fetchProfile = async () => {
    try {
      let data = null;
      if (groupId) {
        data = await GroupChatService.getGroupDetails(groupId);
      }
      setGroupProfile(data?.groupDetails);
      setIsFollowing(data?.isFollowing);
      setIsPublicProfile(data?.userDetails?.isPrivate === false);
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  };
  useEffect(() => {
    fetchProfile();
  }, [groupId, setIsPublicProfile]);

  // follow and unfollow a user
  const handleFollow = async () => {
    try {
      if (user?._id && groupId)
        await FollowService.followOrUnfollowUser(isFollowing, {
          followerId: user?._id,
          followeeId: groupId,
        });

      fetchProfile();
      updateUser();
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error("Failed to follow/unfollow:", err);
    }
  };

  const onProfileClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const onLeaveGroup = async (groupId: string) => {
    if (user) await GroupChatService.removeGroupMember(groupId, user?._id);
    navigate(`/`);
  };

  const updateOpenDeleteChatDialog = () => {
    setOpenDeleteChatDialog(!openDeleteChatDialog);
  };

  const updateOpenLeaveGroupDialog = () => {
    setOpenLeaveGroupDialog(!openLeaveGroupDialog);
  };

  const deleteChat = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  const addMemberToGroupChat = async (groupId: string, userId: string[]) => {
    await GroupChatService.addGroupMembers(groupId, userId);
  };

  return {
    user,
    groupProfile,
    isPublicProfile,
    isFollowing,
    openDeleteChatDialog,
    openLeaveGroupDialog,
    setIsPublicProfile,
    setIsFollowing,
    handleFollow,
    onProfileClick,
    onLeaveGroup,
    updateOpenDeleteChatDialog,
    updateOpenLeaveGroupDialog,
    deleteChat,
    addMemberToGroupChat,
  };
};

export default useGroupProfile;
