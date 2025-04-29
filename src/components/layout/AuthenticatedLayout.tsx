import React from "react";
import { NavBar } from "../navbar";
import { LeftPanel, RightPanel } from "../sidePanels";
import { useHome } from "../../hooks";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  const { showCreatePostModal, handleCancelPost, openCreatePostModal } =
    useHome();

  return (
    <>
      <NavBar />
      <div className="hidden lg:block fixed top-16 left-0 w-48 xl:w-72 2xl:w-96 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ease-in-out overflow-y-auto z-10">
        <LeftPanel
          showCreatePostModal={showCreatePostModal}
          handleCancelPost={handleCancelPost}
          openCreatePostModal={openCreatePostModal}
        />
      </div>
      <div className="min-h-screen bg-gray-100 sm:pt-16 pt-10">{children}</div>
      {/* <div className="hidden lg:block fixed top-16 right-0 w-48 xl:w-72 2xl:w-96 h-[calc(100vh-4rem)] bg-white transition-all duration-300 ease-in-out overflow-y-auto z-10">
        <RightPanel
          showCreatePostModal={showCreatePostModal}
          handleCancelPost={handleCancelPost}
          openCreatePostModal={openCreatePostModal}
        />
      </div> */}
    </>
  );
};

export default AuthenticatedLayout;
