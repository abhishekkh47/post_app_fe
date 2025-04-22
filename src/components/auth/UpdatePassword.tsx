import React, { useState } from "react";
// import { Lock } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../../services";

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserService.updatePassword(
        oldPassword,
        newPassword
      );
      if (response) {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("Invalid password");
    }
  };

  const updateOldPassword = (password: string) => {
    setOldPassword(password);
  };
  const updateNewPassword = (password: string) => {
    setNewPassword(password);
  };
  const updateConfirmNewPassword = (password: string) => {
    setConfirmNewPassword(password);
  };

  return (
    <div className="bg-gray-200 flex flex-col max-h-dvh">
      <div className="max-w-md border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
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
                <div className="items-center border border-gray-300 p-2 rounded-md mb-2">
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => updateOldPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                    placeholder="Current password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="items-center border border-gray-300 p-2 rounded-md mb-2">
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => updateNewPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                    placeholder="New password"
                    autoComplete="current-password"
                  />
                </div>
                <div className="items-center border border-gray-300 p-2 rounded-md mb-2">
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => updateConfirmNewPassword(e.target.value)}
                    className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                    placeholder="Confirm new password"
                    autoComplete="current-password"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end p-2 space-x-2">
            <button
              type="button"
              onClick={() => navigate("/")}
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
