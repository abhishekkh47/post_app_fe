import { useAuth } from "../context/AuthContext";
import { JoinGroupDialog } from "../components/dialog";
import { useHome } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";
import { ChatDrawer } from "../components/chat";
import { PostFeed } from "../components/post";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;

  const { showGroupJoinModal, inviteToken, handleCancel, handleJoin } =
    useHome();
  const { joinGroupData } = useJoinGroup();

  return (
    <div className="w-full lg:pl-64 xl:pr-80">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PostFeed />
      </div>
      <div className="w-80 fixed top-16 right-0 h-[calc(100vh-4rem)] hidden sm:block z-50">
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
