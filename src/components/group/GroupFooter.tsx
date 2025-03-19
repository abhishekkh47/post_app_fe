import React from "react";
import { Group, User } from "../../types";
import { ChatAction } from "../dialog";
import { CHAT_GROUP_DIALOG } from "../../utils";

interface GroupFooterProps {
  user: User | null;
  groupProfile: Group | null;
  openDeleteChatDialog: boolean;
  openLeaveGroupDialog: boolean;
  onLeaveGroup: (userId: string) => void;
  updateDeleteChatDialog: () => void;
  updateLeaveGroupDialog: () => void;
  deleteChat: (groupId: string) => void;
}

const GroupFooter: React.FC<GroupFooterProps> = ({
  user,
  groupProfile,
  openDeleteChatDialog,
  openLeaveGroupDialog,
  onLeaveGroup,
  updateDeleteChatDialog,
  updateLeaveGroupDialog,
  deleteChat,
}) => {
  const { DELETE_CHAT, LEAVE_GROUP } = CHAT_GROUP_DIALOG;
  if (!groupProfile) {
    return <div>Loading users...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-5 mt-3">
        <div className="label flex items-center text-lg font-medium text-red-600 justify-center">
          <button onClick={updateDeleteChatDialog}>Delete Chat</button>
        </div>
      </div>
      {openDeleteChatDialog && (
        <ChatAction
          open={openDeleteChatDialog}
          groupId={groupProfile._id}
          handleOpen={updateDeleteChatDialog}
          handler={deleteChat}
          type={DELETE_CHAT}
        />
      )}
      <div className="bg-white rounded-lg shadow-md p-5 mt-3">
        <div className="label flex items-center text-lg font-medium text-red-600 justify-center">
          <button onClick={updateLeaveGroupDialog}>Leave Group</button>
        </div>
      </div>
      {openLeaveGroupDialog && (
        <ChatAction
          open={openLeaveGroupDialog}
          groupId={groupProfile._id}
          handleOpen={updateLeaveGroupDialog}
          handler={onLeaveGroup}
          type={LEAVE_GROUP}
        />
      )}
    </div>
  );
};

export default GroupFooter;
