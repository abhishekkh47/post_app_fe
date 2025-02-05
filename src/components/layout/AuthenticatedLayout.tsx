import React from "react";
import { NavBar } from "../navbar/navbar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
}) => {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gray-100">{children}</div>
    </>
  );
};
