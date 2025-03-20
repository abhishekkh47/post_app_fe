import { useEffect, useState } from "react";
import { Group, User } from "../types";
import { GROUP_CHAT_USER_ROLE } from "../utils";
import { FollowService } from "../services";

interface useGroupUserListProps {
  user: User | null;
  groupProfile: Group | null;
  removeMemberFromGroup: (groupId: string, userId: string) => void;
  isGroupAdmin: (group: Group, userId?: string) => boolean;
  updateUserRole: (groupId: string, userId: string, role: string) => void;
}

const useGroupUserList = ({
  user,
  groupProfile,
  removeMemberFromGroup,
  isGroupAdmin,
  updateUserRole,
}: useGroupUserListProps) => {
  const { ADMIN, MEMBER } = GROUP_CHAT_USER_ROLE;
  const [friends, setFriends] = useState<User[]>([]);
  const [openNotAdminDialog, setOpenNotAdminDialog] = useState<boolean>(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  const updateOpenNotAdminDialog = () => {
    setOpenNotAdminDialog(!openNotAdminDialog);
  };

  const fetchFriends = async () => {
    try {
      if (user) {
        const myFriends = await FollowService.getFriends();
        setFriends(myFriends.friends || []);
      }
    } catch (error) {
      console.error((error as Error).message);
    }
  };

  const handleRemoveMember = (userId: string) => {
    if (groupProfile) {
      if (!isGroupAdmin(groupProfile)) {
        setOpenNotAdminDialog(true);
      } else {
        removeMemberFromGroup(groupProfile._id, userId);
      }
    }
  };

  const handleUpdateUserRole = (userId: string) => {
    if (groupProfile) {
      const ifAdmin = isGroupAdmin(groupProfile, userId);
      if (!isGroupAdmin(groupProfile)) {
        setOpenNotAdminDialog(true);
      } else {
        updateUserRole(groupProfile._id, userId, ifAdmin ? MEMBER : ADMIN);
      }
    }
  };

  return {
    friends,
    openNotAdminDialog,
    updateOpenNotAdminDialog,
    handleRemoveMember,
    handleUpdateUserRole,
  };
};

export default useGroupUserList;
