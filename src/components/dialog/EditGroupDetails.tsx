"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface IEditGroupDetails {
  open: boolean;
  handleOpen: () => void;
  handler: (name: string, description: string) => void;
  formData: { name: string; description: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditGroupDetails: React.FC<IEditGroupDetails> = ({
  open,
  handleOpen,
  handler,
  formData,
  handleChange,
}) => {
  return (
    <Dialog open={open} onClose={handleOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <form
          className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          onSubmit={(e) => {
            e.preventDefault();
            handler(formData.name, formData.description);
          }}
        >
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
                    Update Group Details
                  </DialogTitle>
                  <div className="mt-8 space-y-6">
                    <div className="rounded-lg shadow-sm -space-y-px">
                      <div className="flex flex-col p-2 rounded-lg bg-white">
                        <div className="flex flex-row items-center border-t border-l border-r border-gray-300 p-2 rounded-t-md">
                          <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                            placeholder="Group Name"
                            autoComplete="groupName"
                          />
                        </div>

                        <div className="flex flex-row items-center border border-gray-300 p-2 rounded-b-md">
                          <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                            placeholder="Group Description"
                            autoComplete="groupDescription"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                // onClick={() => handler(group._id)}
                className="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 sm:ml-3 sm:w-auto"
              >
                Update
              </button>
              <button
                type="button"
                data-autofocus
                onClick={() => handleOpen()}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </form>
      </div>
    </Dialog>
  );
};

export default EditGroupDetails;
