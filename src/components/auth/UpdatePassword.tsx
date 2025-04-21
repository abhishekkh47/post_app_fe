import React, { useState } from "react";
// import { Lock } from "lucide-react";
import { Footer } from "../footer";
import { useLocation, useNavigate } from "react-router-dom";
import { UserService } from "../../services";

const UpdatePassword: React.FC = () => {
  const navigate = useNavigate();
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserService.sendResetPasswordLink(newPassword);
      if (response) {
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const updateOldPassword = (password: string) => {
    setOldPassword(password);
  };
  const updateNewPassword = (password: string) => {
    setNewPassword(password);
  };

  return (
    <div>
      <div className="flex flex-row w-full bg-white border-t-2 h-14">
        <div className="text-blue-600 ml-10 p-1 text-3xl font-semibold">
          postal
        </div>
      </div>
      <div className="bg-gray-200 flex flex-col max-h-dvh">
        <div className="max-w-md border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
          <form className="space-y-2" onSubmit={handleSubmit}>
            <div className="pl-2 font-bold text-lg">Reset Password</div>
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            <div className="border border-gray-100"></div>
            <div className="text-md p-2">
              Please enter your email address or mobile number to search for
              your account.
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
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="items-center border border-gray-300 p-2 rounded-md mb-2">
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => updateOldPassword(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </div>
                  <div className="items-center border border-gray-300 p-2 rounded-md mb-2">
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => updateNewPassword(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                      placeholder="Password"
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
                disabled={!oldPassword || !newPassword}
                className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex min-h-[vh15] text-gray-500 items-center justify-center mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default UpdatePassword;
