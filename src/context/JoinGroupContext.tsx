// GroupContext.tsx
import React, { createContext, useContext, useState } from "react";
import { GroupDetails } from "../types";

interface JoinGroupContextType {
  joinGroupData: GroupDetails | null;
  updateJoinGroupData: (data: GroupDetails) => void;
}

const JoinGroupContext = createContext<JoinGroupContextType | undefined>(
  undefined
);

export const useJoinGroup = (): JoinGroupContextType => {
  const context = useContext(JoinGroupContext);
  if (!context) {
    throw new Error("useGroup must be used within a GroupProvider");
  }
  return context;
};

export const JoinGroupProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [joinGroupData, setJoinGroupData] = useState<GroupDetails | null>(null);

  const updateJoinGroupData = (data: GroupDetails) => {
    setJoinGroupData(data);
  };

  return (
    <JoinGroupContext.Provider value={{ joinGroupData, updateJoinGroupData }}>
      {children}
    </JoinGroupContext.Provider>
  );
};
