import { useEffect, useState } from "react";
import { GroupChatService } from "../services";
import { useLocation } from "react-router-dom";

const useHome = () => {
  const [showGroupJoinModal, setShowGroupJoinModal] = useState<boolean>(false);
  const [showCreatePostModal, setShowCreatePostModal] =
    useState<boolean>(false);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get("inviteToken");
    if (token) {
      setInviteToken(token);
      setShowGroupJoinModal(true);
    }
  }, []);

  const handleJoin = async (token: string) => {
    await GroupChatService.joinGroupUsingInviteLink(token);
    setShowGroupJoinModal(false);
  };

  const handleCancel = () => {
    setShowGroupJoinModal(false);
  };

  const handleCancelPost = () => {
    setShowCreatePostModal(false);
  };

  const updateCreatePostModal = () => {
    setShowCreatePostModal(true);
  };

  const openCreatePostModal = () => {
    setShowCreatePostModal(true);
  };

  return {
    showGroupJoinModal,
    inviteToken,
    showCreatePostModal,
    handleJoin,
    handleCancel,
    handleCancelPost,
    updateCreatePostModal,
    openCreatePostModal,
  };
};

export default useHome;
