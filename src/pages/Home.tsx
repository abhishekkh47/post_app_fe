import { useAuth } from "../context/AuthContext";
import {
  JoinGroupDialog,
  CreatePost as CreatePostDialog,
} from "../components/dialog";
import { useHome } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";
import { ChatDrawer } from "../components/chat";
import { PostFeed } from "../components/post";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;

  const {
    showGroupJoinModal,
    inviteToken,
    showCreatePostModal,
    handleCancel,
    handleJoin,
    handleCancelPost,
    openCreatePostModal,
  } = useHome();

  const { joinGroupData } = useJoinGroup();

  return (
    <div className="flex flex-col">
      <button
        onClick={openCreatePostModal}
        className="bg-blue-600 size-10 rounded-full fixed block lg:hidden bottom-4 right-4 z-50 align-middle"
      >
        +
      </button>

      <div className="flex-1 justify-between max-w-xl xl:max-w-4xl mx-auto py-8 px-4 w-full">
        <PostFeed />
      </div>
      <div className="hidden lg:block">
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
      {showCreatePostModal && (
        <CreatePostDialog handleCancelPost={handleCancelPost} />
      )}
    </div>
  );
};

export default Home;
