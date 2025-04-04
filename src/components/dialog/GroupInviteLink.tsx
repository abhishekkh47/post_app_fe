"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";
import {
  ExclamationTriangleIcon,
  DocumentDuplicateIcon,
  ShareIcon,
  QrCodeIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/outline";
import { GroupDetails } from "../../types";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import QRCode from "react-qr-code";
import { ProfilePicture } from "../profile";

interface IGroupInviteLink {
  groupData: GroupDetails;
  open: boolean;
  handleCancel: () => void;
  inviteToken?: string;
  handleResetLink: (groupId: string) => void;
}

const GroupInviteLink: React.FC<IGroupInviteLink> = ({
  groupData,
  open,
  handleCancel,
  inviteToken,
  handleResetLink,
}) => {
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  const inviteLink = `http://localhost:5173/group/members/join/${inviteToken}`;
  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    toast("Link Copied");
  };

  const handleShowQRCode = () => {
    setShowQrCode(!showQrCode);
  };

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
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10">
                  <ExclamationTriangleIcon
                    aria-hidden="true"
                    className="size-6 text-red-600"
                  />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold text-gray-900"
                  >
                    Group Link
                  </DialogTitle>
                  {/* <div> */}
                  <p className="text-sm text-gray-500">
                    People with this link do not need admin approval to join
                    this group.
                  </p>
                  {/* </div> */}
                </div>
              </div>
              <div className="mt-3">
                <div className="flex flex-row p3">
                  <ProfilePicture
                    profile_pic={groupData?.profile_pic}
                    firstName={groupData?.name || ""}
                    size={12}
                    text={`2xl`}
                  />
                  <div className="flex flex-col ml-2">
                    <div className="text-sm">{groupData.name}</div>
                    <div className="text-xs text-balance text-green-600">
                      {inviteToken ? inviteLink : ""}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t-2 mt-4">
                <ul className="mt-2">
                  <div
                    className="flex p-2 space-x-6 ml-1 hover:bg-slate-100 hover:cursor-pointer"
                    onClick={handleCopyLink}
                  >
                    <DocumentDuplicateIcon className="size-5 mt-[2px]" />
                    <li>Copy link</li>
                  </div>
                  <div className="flex p-2 space-x-6 ml-1 hover:bg-slate-100 hover:cursor-pointer">
                    <ShareIcon className="size-5 mt-[2px]" />
                    <li>Share link</li>
                  </div>
                  <div
                    className="flex p-2 space-x-6 ml-1 hover:bg-slate-100 hover:cursor-pointer"
                    onClick={handleShowQRCode}
                  >
                    <QrCodeIcon className="size-5 mt-[2px]" />
                    <li>QR code</li>
                  </div>
                  <div
                    className="flex p-2 space-x-6 ml-1 hover:bg-slate-100 hover:cursor-pointer text-red-600"
                    onClick={() => {
                      handleResetLink(groupData._id);
                    }}
                  >
                    <MinusCircleIcon className="size-5 mt-[2px]" />
                    <li>Reset link</li>
                  </div>
                </ul>
                {showQrCode && ( // Conditionally render QR code
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: 64,
                      width: "100%",
                    }}
                  >
                    <QRCode
                      value={inviteLink}
                      size={256}
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
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
        <ToastContainer />
      </div>
    </Dialog>
  );
};

export default GroupInviteLink;
