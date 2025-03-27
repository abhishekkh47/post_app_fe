import { useRef, useState } from "react";
import { Group, GroupDetails } from "../types";
import { GroupChatService } from "../services";

interface GroupProfileProps {
  groupProfile: Group;
  isGroupAdmin: (group: Group) => boolean;
  updateGroupDetails: (groupId: string, data: GroupDetails) => void;
  fetchGroupDetails: (groupId: string) => void;
}

const useGroupProfile = ({
  groupProfile,
  isGroupAdmin,
  updateGroupDetails,
  fetchGroupDetails,
}: GroupProfileProps) => {
  const [openNotAdminDialog, setOpenNotAdminDialog] = useState<boolean>(false);
  const [openUpdateGroupDialog, setOpenUpdateGroupDialog] =
    useState<boolean>(false);
  const [groupData, setGroupData] = useState<GroupDetails>({
    _id: groupProfile?._id || "",
    name: groupProfile.name,
    description: groupProfile.description,
    profile_pic: groupProfile.profile_pic,
  });
  const [openGroupInviteOptions, setOpenGroupInviteOption] =
    useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateOpenNotAdminDialog = () => {
    setOpenNotAdminDialog(!openNotAdminDialog);
  };

  const updateOpenGroupInviteOptions = () => {
    setOpenGroupInviteOption(!openGroupInviteOptions);
  };

  const updateOpenUpdateGroupDialog = () => {
    setOpenUpdateGroupDialog(!openUpdateGroupDialog);
    setGroupData({
      _id: groupProfile?._id || "",
      name: groupProfile.name,
      description: groupProfile.description,
      profile_pic: groupProfile.profile_pic,
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
    updateGroupDetails(groupProfile._id, { _id: "", name, description });
    updateOpenUpdateGroupDialog();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Function to handle file selection
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const response = await GroupChatService.updateGroupProfilePicture(
        groupProfile._id,
        file
      );
      if (response.filename) {
        setGroupData((prev) => ({
          ...prev,
          profile_pic: response.filename,
        }));
      }
    }
  };

  const handleResetLink = async (groupId: string) => {
    await GroupChatService.resetGroupInviteLink(groupId);
    fetchGroupDetails(groupId);
  };

  return {
    groupData,
    openNotAdminDialog,
    openUpdateGroupDialog,
    fileInputRef,
    openGroupInviteOptions,
    handleEditClick,
    updateGroupDetailsHandler,
    handleChange,
    updateOpenNotAdminDialog,
    updateOpenUpdateGroupDialog,
    handleUploadClick,
    handleFileChange,
    updateOpenGroupInviteOptions,
    handleResetLink,
  };
};

export default useGroupProfile;
