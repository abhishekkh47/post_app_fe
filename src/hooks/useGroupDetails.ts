import { useState, useEffect } from "react";
import { Group, GroupDetails } from "../types";
import { useAuth } from "../context/AuthContext";
import { FollowService, GroupChatService } from "../services";
import { useNavigate } from "react-router-dom";

interface GroupDetailsProps {
  groupId: string | undefined;
}

const useGroupDetails = ({ groupId }: GroupDetailsProps) => {
  const [groupProfile, setGroupProfile] = useState<Group | null>(null);
  const [isPublicProfile, setIsPublicProfile] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [openDeleteChatDialog, setOpenDeleteChatDialog] =
    useState<boolean>(false);
  const [openLeaveGroupDialog, setOpenLeaveGroupDialog] =
    useState<boolean>(false);
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // get group details
  const fetchGroupDetails = async () => {
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
    fetchGroupDetails();
  }, [groupId, setIsPublicProfile]);

  // follow and unfollow a user
  const handleFollow = async () => {
    try {
      if (user?._id && groupId)
        await FollowService.followOrUnfollowUser(isFollowing, {
          followerId: user?._id,
          followeeId: groupId,
        });

      fetchGroupDetails();
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

  // non-funcitonal
  const deleteChat = (groupId: string) => {
    navigate(`/group/${groupId}`);
  };

  const addMemberToGroupChat = async (groupId: string, userId: string[]) => {
    await GroupChatService.addGroupMembers(groupId, userId);
    await fetchGroupDetails();
    toggleAddUserModal(false);
  };

  const removeMemberFromGroup = async (groupId: string, userId: string) => {
    await GroupChatService.removeGroupMember(groupId, userId);
    await fetchGroupDetails();
  };

  const toggleAddUserModal = (status: boolean) => setIsAddUserModalOpen(status);

  const isGroupAdmin = (group: Group, userId: string = "") => {
    if (!userId) {
      userId = user?._id || "";
    }
    return group.members.some(
      (member) => member.userId === userId && member.role === "admin"
    );
  };

  const updateGroupDetails = async (groupId: string, data: GroupDetails) => {
    const { name, description = "" } = data;
    await GroupChatService.updateGroup(groupId, name, description);
    await fetchGroupDetails();
  };

  const updateUserRole = async (
    groupId: string,
    userId: string,
    role: string
  ) => {
    await GroupChatService.updateUserRole(groupId, userId, role);
    await fetchGroupDetails();
  };

  return {
    user,
    groupProfile,
    isPublicProfile,
    isFollowing,
    openDeleteChatDialog,
    openLeaveGroupDialog,
    isAddUserModalOpen,
    setIsPublicProfile,
    setIsFollowing,
    handleFollow,
    onProfileClick,
    onLeaveGroup,
    updateOpenDeleteChatDialog,
    updateOpenLeaveGroupDialog,
    deleteChat,
    addMemberToGroupChat,
    removeMemberFromGroup,
    toggleAddUserModal,
    isGroupAdmin,
    updateGroupDetails,
    updateUserRole,
  };
};

export default useGroupDetails;
