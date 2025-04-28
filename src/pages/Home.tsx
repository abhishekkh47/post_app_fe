import { useAuth } from "../context/AuthContext";
import {
  JoinGroupDialog,
  CreatePost as CreatePostDialog,
} from "../components/dialog";
import { useHome, usePostFeed } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";
import { ChatDrawer } from "../components/chat";
import { PostFeed } from "../components/post";
import { LeftPanel, RightPanel } from "../components/sidePanels";

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
  const { fetchPosts } = usePostFeed();

  return (
    <div className="flex flex-col">
      <button
        onClick={openCreatePostModal}
        className="bg-blue-600 size-10 rounded-full fixed block lg:hidden bottom-4 right-4 z-50 align-middle"
      >
        +
      </button>
      <div className="hidden lg:block fixed top-16 left-0 w-48 xl:w-72 2xl:w-96 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ease-in-out">
        <LeftPanel />
      </div>
      <div className="hidden lg:block fixed top-16 right-0 w-48 xl:w-72 2xl:w-96 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ease-in-out">
        <RightPanel
          fetchPosts={fetchPosts}
          showCreatePostModal={showCreatePostModal}
          handleCancelPost={handleCancelPost}
          openCreatePostModal={openCreatePostModal}
        />
      </div>

      <div className="flex-1 justify-between max-w-xl xl:max-w-4xl mx-auto py-8 px-4">
        <PostFeed />
      </div>
      <div className="w-80 fixed h-[calc(100vh-4rem)] hidden lg:block">
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
        <CreatePostDialog
          fetchPosts={fetchPosts}
          handleCancelPost={handleCancelPost}
        />
      )}
    </div>
  );
};

export default Home;
