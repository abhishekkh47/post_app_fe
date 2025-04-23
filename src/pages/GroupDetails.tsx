import React from "react";
import { useParams } from "react-router-dom";
import { GroupFooter, GroupProfile, GroupUserList } from "../components/group";
import { useGroupDetails } from "../hooks";

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const {
    user,
    groupProfile,
    openDeleteChatDialog,
    openLeaveGroupDialog,
    isAddUserModalOpen,
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
    fetchGroupDetails,
  } = useGroupDetails({ groupId });

  if (!groupId) {
    return <div>User Not Found ...</div>; // Handle the case when user is undefined
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto py-8 px-4 mt-16">
      <div>
        <GroupProfile
          groupProfile={groupProfile}
          isGroupAdmin={isGroupAdmin}
          updateGroupDetails={updateGroupDetails}
          fetchGroupDetails={fetchGroupDetails}
        />
      </div>
      <div className="mt-4">
        <GroupUserList
          user={user}
          groupProfile={groupProfile}
          onProfileClick={onProfileClick}
          addMemberToGroupChat={addMemberToGroupChat}
          removeMemberFromGroup={removeMemberFromGroup}
          isAddUserModalOpen={isAddUserModalOpen}
          toggleAddUserModal={toggleAddUserModal}
          isGroupAdmin={isGroupAdmin}
          updateUserRole={updateUserRole}
        />
      </div>
      <div className="mt-4">
        <GroupFooter
          groupProfile={groupProfile}
          onLeaveGroup={onLeaveGroup}
          openDeleteChatDialog={openDeleteChatDialog}
          openLeaveGroupDialog={openLeaveGroupDialog}
          updateDeleteChatDialog={updateOpenDeleteChatDialog}
          updateLeaveGroupDialog={updateOpenLeaveGroupDialog}
          deleteChat={deleteChat}
        />
      </div>
    </div>
  );
};

export default GroupDetails;
