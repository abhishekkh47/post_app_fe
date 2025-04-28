import { useAuth } from "../context/AuthContext";
import { JoinGroupDialog } from "../components/dialog";
import { useHome, usePostFeed } from "../hooks";
import { useJoinGroup } from "../context/JoinGroupContext";
import { ChatDrawer } from "../components/chat";
import { CreatePostV2, PostFeed } from "../components/post";
import { X } from "lucide-react";

const Home: React.FC = () => {
  const { user } = useAuth();
  if (!user) return;

  const {
    showGroupJoinModal,
    inviteToken,
    handleCancel,
    handleJoin,
    handleCancelPost,
    showCreatePostModal,
    updateCreatePostModal,
  } = useHome();
  const { fetchPosts } = usePostFeed();
  const { joinGroupData } = useJoinGroup();

  return (
    <div className="flex">
      <button
        className="fixed top-16 sm:top-24 right-6 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all z-10 md:px-6 md:py-3 md:w-auto md:h-auto w-14 h-14 flex items-center justify-center"
        onClick={updateCreatePostModal}
      >
        <span className="hidden md:inline">➕ Create Post</span>
        <span className="md:hidden text-xl">➕</span>
      </button>
      {/* Modal */}
      {showCreatePostModal && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50"
          onClick={handleCancelPost} // Close modal when clicking outside
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-lg p-4 relative"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              onClick={handleCancelPost}
              className="absolute top-0 right-0 text-gray-500 hover:text-red-500"
            >
              <X className="w-5 h-5" />
            </button>

            <CreatePostV2 fetchPosts={fetchPosts} />
          </div>
        </div>
      )}

      <div className="flex-1 max-w-4xl mx-auto py-8 px-4">
        <PostFeed />
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
