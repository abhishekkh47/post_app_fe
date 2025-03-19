import React from "react";
import { useParams } from "react-router-dom";
import { GroupFooter, GroupProfile, GroupUserList } from "../components/group";
import { useGroupProfile } from "../hooks";

const GroupDetails: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const {
    user,
    groupProfile,
    openDeleteChatDialog,
    openLeaveGroupDialog,
    onProfileClick,
    onLeaveGroup,
    updateOpenDeleteChatDialog,
    updateOpenLeaveGroupDialog,
    deleteChat,
    addMemberToGroupChat,
  } = useGroupProfile({ groupId });

  if (!groupId) {
    return <div>User Not Found ...</div>; // Handle the case when user is undefined
  }

  return (
    <div className="flex flex-col max-w-2xl mx-auto py-8 px-4">
      <div>
        <GroupProfile user={user} groupProfile={groupProfile} />
      </div>
      <div className="mt-4">
        <GroupUserList
          user={user}
          groupProfile={groupProfile}
          onProfileClick={onProfileClick}
          addMemberToGroupChat={addMemberToGroupChat}
        />
      </div>
      <div className="mt-4">
        <GroupFooter
          user={user}
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
