import { useState } from "react";
import { Group, GroupDetails } from "../types";

interface GroupProfileProps {
  groupProfile: Group;
  isGroupAdmin: (group: Group) => boolean;
  updateGroupDetails: (groupId: string, data: GroupDetails) => void;
}

const useGroupProfile = ({
  groupProfile,
  isGroupAdmin,
  updateGroupDetails,
}: GroupProfileProps) => {
  const [openNotAdminDialog, setOpenNotAdminDialog] = useState<boolean>(false);
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] =
    useState<boolean>(false);
  const [groupData, setGroupData] = useState({
    name: groupProfile.name,
    description: groupProfile.description,
  });

  const updateOpenNotAdminDialog = () => {
    setOpenNotAdminDialog(!openNotAdminDialog);
  };

  const updateOpenUpdateGroupDialog = () => {
    setOpenUpdateGroupDialog(!openUpdateGroupDialog);
    setGroupData({
      name: groupProfile.name,
      description: groupProfile.description,
    });
  };

  const handleEditClick = () => {
    if (!isGroupAdmin(groupProfile)) {
      updateOpenNotAdminDialog();
    } else {
      updateOpenUpdateGroupDialog();
    }
  };

  const updateGroupDetailsHandler = (name: string, description: string) => {
    updateGroupDetails(groupProfile._id, { name, description });
    updateOpenUpdateGroupDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    groupData,
    openNotAdminDialog,
    openUpdateGroupDialog,
    handleEditClick,
    updateGroupDetailsHandler,
    handleChange,
    updateOpenNotAdminDialog,
    updateOpenUpdateGroupDialog,
  };
};

export default useGroupProfile;
