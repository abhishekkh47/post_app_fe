import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "../footer";
import { UserService } from "../../services";

const SearchAccount: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [mailSent, setMailSent] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await UserService.sendResetPasswordLink(email);
      if (response) {
        setMailSent(true);
      }
    } catch (err) {
      setError("Invalid email");
    }
  };

  const updateEmail = (email: string) => {
    setEmail(email);
  };

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
      {mailSent ? (
        <div className="bg-gray-200 flex flex-col max-h-dvh min-h-96">
          <div className="max-w-md border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
            <div className="text-md p-2">
              Please check your email to update your password.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-200 flex flex-col max-h-dvh">
          <div className="max-w-md border rounded-md p-2 items-center justify-center mx-auto mt-20 bg-white shadow-md mb-32">
            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="pl-2 font-bold text-lg">Search Your Account</div>
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
                <div className="flex flex-col p-2 rounded-lg bg-white">
                  {/* Email Input */}
                  <div className="flex flex-row items-center border border-gray-300 p-2 rounded-md mb-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => updateEmail(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                      placeholder="Email address"
                      autoComplete="email"
                    />
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
                  disabled={!email}
                  className="justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex min-h-[vh15] text-gray-500 items-center justify-center mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default SearchAccount;
