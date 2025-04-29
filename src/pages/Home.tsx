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
    <div className="w-full lg:pl-48 xl:pl-72 2xl:pl-96 lg:pr-48 xl:pr-72 2xl:pr-96 transition-all duration-300">
      <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PostFeed />
      </div>
      <ChatDrawer user={user} />
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
