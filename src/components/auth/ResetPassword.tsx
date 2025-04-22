import React from "react";
import { Footer } from "../footer";
import { useNavigate } from "react-router-dom";
import { useResetPassword } from "../../hooks";

const ResetPassword: React.FC = () => {
  const {
    error,
    newPassword,
    confirmPassword,
    showNewPassword,
    showConfirmPassword,
    handleSubmit,
    updateNewPassword,
    updateConfirmPassword,
    updateShowNewPassword,
    updateShowConfirmPassword,
  } = useResetPassword();

  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-row w-full bg-white border-t-2 h-14">
        <div className="text-blue-600 ml-10 p-1 text-3xl font-semibold">
          postal
        </div>
        <div className="p-2 ml-auto mr-2 flex space-x-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Signup
          </button>
        </div>
      </div>
      <div className="bg-gray-200 flex flex-col max-h-dvh">
        <div className="max-w-md w-full border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="pl-2 font-bold text-lg">Reset Password</div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="border border-gray-100"></div>
            <div className="rounded-lg shadow-sm -space-y-px">
              {/* Outer Box (Rounded Corners) */}
              <div className="p-2 rounded-lg bg-white">
                <div className="flex flex-col">
                  <div className="items-center border border-gray-300 p-2 rounded-md mb-2 relative">
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => updateNewPassword(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                      placeholder="New Password"
                      autoComplete=""
                    />
                    <button
                      type="button"
                      onClick={() => updateShowNewPassword()}
                      className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? "👁️" : "🙈"}
                    </button>
                  </div>
                  <div className="items-center border border-gray-300 p-2 rounded-md mb-2 relative">
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => updateConfirmPassword(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm w-full"
                      placeholder="Confirm Password"
                      autoComplete=""
                    />
                    <button
                      type="button"
                      onClick={() => updateShowConfirmPassword()}
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
                onClick={() => navigate("/")}
                className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  !confirmPassword ||
                  !newPassword ||
                  newPassword !== confirmPassword
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
              confirmPassword &&
              newPassword !== confirmPassword && (
                <div className="space-y-1">
                  <div className="text-red-500 text-sm font-medium">
                    Password do not match
                  </div>
                </div>
              )}
          </form>
        </div>
      </div>
      <div className="flex min-h-[vh15] text-gray-500 items-center justify-center mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default ResetPassword;
