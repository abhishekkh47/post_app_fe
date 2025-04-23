import React from "react";
import { NavBar } from "../navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100 sm:pt-16 pt-10">{children}</div>
    </>
  );
};

export default AuthenticatedLayout;
