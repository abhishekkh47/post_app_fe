import React from "react";
import { Mail, Lock } from "lucide-react";
import { AnimatedBrand } from "../brand";
import { Footer } from "../footer";
import { useLogin } from "../../hooks";

const LoginForm: React.FC = () => {
  const {
    email,
    error,
    handleSubmit,
    password,
    updateEmail,
    updatePassword,
    navigate,
  } = useLogin();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex min-h-[85vh] items-center justify-centershadow-md bg-pink-100">
        <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto space-y-10 md:space-y-0 md:space-x-16">
          {/* Left Side - Branding */}
          <AnimatedBrand />

          {/* Right Side - Login Form */}
          <div className="max-w-md w-full space-y-6 p-4 bg-white rounded-lg shadow-md">
            {/* <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div> */}
            <form className="space-y-2" onSubmit={handleSubmit}>
              {error && (
                <div className="text-red-500 text-sm text-center">{error}</div>
              )}
              <div className="rounded-lg shadow-sm -space-y-px">
                {/* Outer Box (Rounded Corners) */}
                <div className="flex flex-col p-2 rounded-lg bg-white">
                  {/* Email Input */}
                  <div className="flex flex-row items-center border-t border-l border-r border-gray-300 p-2 rounded-t-md">
                    <Mail className="h-5 w-5 text-gray-400 mr-2" />
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

                  {/* Password Input */}
                  <div className="flex flex-row items-center border border-gray-300 p-2 rounded-b-md">
                    <Lock className="h-5 w-5 text-gray-400 mr-2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => updatePassword(e.target.value)}
                      className="flex-1 px-4 py-1 border-none focus:outline-none sm:text-sm"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </div>
                </div>
              </div>

              <div className="pl-2 pr-2">
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Sign in
                </button>
                <br />
                <div
                  className="flex justify-center hover:underline"
                  onClick={() => navigate("/login/identity")}
                >
                  forgot password?
                </div>
              </div>
            </form>
            <div className="border"></div>
            <div className="flex justify-center">
              <button
                onClick={() => navigate("/signup")}
                type="button"
                className="group relative w-[60%] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Create new account
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex min-h-[vh15] text-gray-500 items-center justify-center mt-10">
        <Footer />
      </div>
    </div>
  );
};

export default LoginForm;
