import React from "react";
import { useSettings } from "../hooks";
import { DeleteAccount } from "../components/dialog";
import { ChevronRight } from "lucide-react";

const Settings: React.FC = () => {
  const {
    publicProfileToggle,
    openDeleteDialog,
    handleProfileToggle,
    updateOpenDeleteDialog,
    handleDelete,
    handleUpdatePasswordClick,
  } = useSettings();

  return (
    <div className="max-w-2xl mx-auto py-8 px-8 mt-16">
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="label flex items-center text-md font-medium text-black">
            Public Profile
            <span className="pl-1"> {publicProfileToggle ? "On" : "Off"} </span>
          </span>
          <label className="autoSaverSwitch relative inline-flex cursor-pointer select-none">
            <span
              className={`slider mr-3 flex h-[26px] w-[50px] items-center rounded-full p-1 duration-200 ${
                publicProfileToggle ? "bg-blue-600" : "bg-[#CCCCCE]"
              }`}
            >
              <span
                className={`dot h-[18px] w-[18px] rounded-full bg-white duration-200 ${
                  publicProfileToggle ? "translate-x-6" : ""
                }`}
              ></span>
            </span>
            <input
              type="checkbox"
              name="autoSaver"
              className="sr-only"
              checked={publicProfileToggle}
              onChange={handleProfileToggle}
            />
          </label>
        </div>
        <div className="flex items-center justify-between">
          <span className="label flex items-center text-md font-medium text-black">
            Update Password
          </span>
          <label className="relative inline-flex cursor-pointer p-1">
            <ChevronRight onClick={handleUpdatePasswordClick} />
          </label>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-5 mt-3">
        <div className="label flex items-center text-lg font-medium text-red-600 justify-center">
          <button onClick={updateOpenDeleteDialog}>Delete Account</button>
        </div>
      </div>
      {openDeleteDialog && (
        <DeleteAccount
          open={openDeleteDialog}
          handleOpen={updateOpenDeleteDialog}
          deleteHandler={handleDelete}
        />
      )}
    </div>
  );
};

export default Settings;
