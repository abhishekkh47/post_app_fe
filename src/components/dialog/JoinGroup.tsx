"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { GroupDetails } from "../../types";
import config from "../../config";

interface IJoinGroup {
  open: boolean;
  handleCancel: () => void;
  joinGroupData: GroupDetails | null;
  inviteToken: string;
  handleJoin: (inviteToken: string) => void;
}

const JoinGroup: React.FC<IJoinGroup> = ({
  open,
  handleCancel,
  joinGroupData,
  inviteToken,
  handleJoin,
}) => {
  return (
    <Dialog open={open} onClose={handleCancel} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                {joinGroupData?.profile_pic ? (
                  <img
                    src={`${config.API_URL}/uploads/${joinGroupData.profile_pic}`}
                    alt={joinGroupData.name}
                    loading="lazy"
                    className="h-14 w-14 rounded-full object-cover cursor-pointer"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-blue-300 flex items-center justify-center text-3xl border border-black cursor-pointer">
                    {joinGroupData?.name[0]?.toUpperCase()}
                  </div>
                )}
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    {joinGroupData?.name}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">Postal Group Invite</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                onClick={() => handleJoin(inviteToken)}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
              >
                Join
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => handleCancel()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default JoinGroup;
