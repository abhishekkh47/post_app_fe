import { useRef, useState } from "react";
import { Group, GroupDetails } from "../types";
import { GroupChatService } from "../services";

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
    profile_pic: groupProfile.profile_pic,
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const updateOpenNotAdminDialog = () => {
    setOpenNotAdminDialog(!openNotAdminDialog);
  };

  const updateOpenUpdateGroupDialog = () => {
    setOpenUpdateGroupDialog(!openUpdateGroupDialog);
    setGroupData({
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

  return {
    groupData,
    openNotAdminDialog,
    openUpdateGroupDialog,
    fileInputRef,
    handleEditClick,
    updateGroupDetailsHandler,
    handleChange,
    updateOpenNotAdminDialog,
    updateOpenUpdateGroupDialog,
    handleUploadClick,
    handleFileChange,
  };
};

export default useGroupProfile;
