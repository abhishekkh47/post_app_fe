import React from "react";
import { useUpdatePassword } from "../../hooks";

const UpdatePassword: React.FC = () => {
  const {
    error,
    oldPassword,
    newPassword,
    confirmNewPassword,
    showOldPassword,
    showNewPassword,
    showConfirmPassword,
    handleSubmit,
    updateOldPassword,
    updateNewPassword,
    updateConfirmNewPassword,
    setShowOldPassword,
    setShowNewPassword,
    setShowConfirmPassword,
    success,
    handleCancel,
  } = useUpdatePassword();

  return (
    <div className="bg-gray-200 flex flex-col max-h-dvh">
      <div className="max-w-md border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
        {success && (
          <div className="transition-all duration-300 ease-in-out text-green-600 text-center p-2 bg-green-100 rounded-md shadow-sm mb-4">
            Password updated successfully!
          </div>
        )}
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div className="pl-2 font-bold text-lg">Update Password</div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="border border-gray-100"></div>
          <div className="text-md p-2">
            Your password should contain at least 8 characters, including at
            least one uppercase letter, one lowercase letter, one number, and
            one special character.
          </div>
          <div className="rounded-lg shadow-sm -space-y-px">
            {/* Outer Box (Rounded Corners) */}
            <div className="p-2 rounded-lg bg-white">
              <div className="flex flex-col">
                <div className="items-center border border-gray-300 p-2 rounded-md mb-2 relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    required
                    value={oldPassword}
                    onChange={(e) => updateOldPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full pr-10"
                    placeholder="Current password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? "👁️" : "🙈"}
                  </button>
                </div>

                <div className="items-center border border-gray-300 p-2 rounded-md mb-2 relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => updateNewPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                    placeholder="New password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? "👁️" : "🙈"}
                  </button>
                </div>
                <div className="items-center border border-gray-300 p-2 rounded-md mb-2 relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => updateConfirmNewPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                    placeholder="Confirm new password"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-2 space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !oldPassword ||
                !newPassword ||
                !confirmNewPassword ||
                confirmNewPassword !== newPassword
              }
              className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update
            </button>
          </div>
          {newPassword &&
            (!/.{8,}/.test(newPassword) ||
              !/(?=.*[A-Z])/.test(newPassword) ||
              !/(?=.*[a-z])/.test(newPassword) ||
              !/(?=.*\W)/.test(newPassword)) && (
              <div className="space-y-1">
                <div className="text-red-500 text-sm font-medium">
                  Password must contain at least:
                </div>
                <ul className="list-disc list-inside text-red-500 text-sm space-y-1">
                  {!/.{8,}/.test(newPassword) && <li>8 characters</li>}
                  {!/(?=.*[A-Z])/.test(newPassword) && (
                    <li>One uppercase letter</li>
                  )}
                  {!/(?=.*[a-z])/.test(newPassword) && (
                    <li>One lowercase letter</li>
                  )}
                  {!/(?=.*\W)/.test(newPassword) && (
                    <li>One special character</li>
                  )}
                </ul>
              </div>
            )}
          {newPassword &&
            confirmNewPassword &&
            newPassword !== confirmNewPassword && (
              <div className="space-y-1">
                <div className="text-red-500 text-sm font-medium">
                  Password do not match
                </div>
              </div>
            )}
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;
