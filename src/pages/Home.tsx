import { useAuth } from "../context/AuthContext";
import { Feed } from "./";
import { JoinGroupDialog } from "../components/dialog";
import { useHome } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";
import { ChatDrawer } from "../components/chat";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;

  const { showGroupJoinModal, inviteToken, handleCancel, handleJoin } =
    useHome();
  const { joinGroupData } = useJoinGroup();

  return (
    <div className="flex">
      <div className="flex-1">
        <Feed />
      </div>
      <div className="w-80 fixed top-16 right-0 h-[calc(100vh-4rem)] hidden sm:block">
        {/* <ChatPage user={user} /> */}
        <ChatDrawer user={user} />
      </div>
      {showGroupJoinModal && inviteToken && (
        <JoinGroupDialog
          open={showGroupJoinModal}
          handleCancel={handleCancel}
          joinGroupData={joinGroupData}
          inviteToken={inviteToken}
          handleJoin={handleJoin}
        />
      )}
    </div>
  );
};

export default Home;
