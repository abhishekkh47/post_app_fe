import React, { useEffect, useState } from "react";
import { Group, User } from "../../types";
import AddGroupMembersModal from "./AddGroupMembersModal";
import { FollowService } from "../../services";

interface GroupProfileProps {
  user: User | null;
  groupProfile: Group | null;
  onProfileClick: (userId: string) => void;
  addMemberToGroupChat: (groupId: string, userId: string[]) => void;
}

const GroupUserList: React.FC<GroupProfileProps> = ({
  user,
  groupProfile,
  onProfileClick,
  addMemberToGroupChat,
}) => {
  if (!user) return;

  const [friends, setFriends] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    fetchFriends();
  }, []);

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 font-bold mb-2">Members</div>
        <div
          onClick={openModal}
          className="text-blue-600 mb-2 hover:cursor-pointer"
        >
          Add friends
        </div>
        <AddGroupMembersModal
          isOpen={isModalOpen}
          onClose={closeModal}
          users={friends} // Pass the list of users to choose from
          user={user}
          groupProfile={groupProfile}
          addMemberToGroupChat={addMemberToGroupChat}
        />
      </div>
      {groupProfile?.members?.length &&
        groupProfile.members.map((member) => {
          return (
            <div key={member._id}>
              <div
                className="flex flex-row items-center space-x-4 p-2 hover:cursor-pointer"
                onClick={() => onProfileClick(member._id)}
              >
                {member?.profile_pic ? (
                  <img
                    src={member.profile_pic}
                    alt={member.firstName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  // <div className="h-12 w-12 rounded-full bg-gray-200" />
                  <div className="h-12 w-12 rounded-full bg-blue-300 flex items-center justify-center text-[30px] border border-black">
                    {member?.firstName[0]?.toUpperCase()}
                  </div>
                )}
                <div>
                  {member.firstName} {member.lastName}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default GroupUserList;
