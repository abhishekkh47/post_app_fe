import { useAuth } from "../context/AuthContext";
import { Feed, ChatPage } from "./";
import { JoinGroupDialog } from "../components/dialog";
import { useHome } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;

  const { showGroupJoinModal, inviteToken, handleCancel, handleJoin } =
    useHome();
  const { joinGroupData } = useJoinGroup();

  return (
    <div className="flex mt-16">
      <div className="flex-1 sm:mr-80">
        <Feed />
      </div>
      <div className="w-96 fixed top-16 right-0 h-[calc(100vh-4rem)] hidden sm:block">
        <ChatPage user={user} />
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
