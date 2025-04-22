import React from "react";
import { Mail, Lock, User } from "lucide-react";
import { useSignup } from "../../hooks";

const SignupForm: React.FC = () => {
  const {
    error,
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    updateShowPassword,
  } = useSignup();
  let validated = false;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Last Name"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => updateShowPassword()}
                className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "👁️" : "🙈"}
              </button>
            </div>
            {formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <div className="text-red-500 text-sm">
                  Invalid email address
                </div>
              )}

            {
              (validated =
                !/.{8,}/.test(formData.password) ||
                !/(?=.*[A-Z])/.test(formData.password) ||
                !/(?=.*[a-z])/.test(formData.password) ||
                !/(?=.*\W)/.test(formData.password))
            }

            {formData.password &&
              (!/.{8,}/.test(formData.password) ||
                !/(?=.*[A-Z])/.test(formData.password) ||
                !/(?=.*[a-z])/.test(formData.password) ||
                !/(?=.*\W)/.test(formData.password)) && (
                <div className="space-y-1">
                  <div className="text-red-500 text-sm font-medium">
                    Password must contain at least:
                  </div>
                  <ul className="list-disc list-inside text-red-500 text-sm space-y-1">
                    {!/.{8,}/.test(formData.password) && <li>8 characters</li>}
                    {!/(?=.*[A-Z])/.test(formData.password) && (
                      <li>One uppercase letter</li>
                    )}
                    {!/(?=.*[a-z])/.test(formData.password) && (
                      <li>One lowercase letter</li>
                    )}
                    {!/(?=.*\W)/.test(formData.password) && (
                      <li>One special character</li>
                    )}
                  </ul>
                </div>
              )}
          </div>

          {/* <div className="flex items-center">
            <input
              type="checkbox"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPrivate"
              className="ml-2 block text-sm text-gray-900"
            >
              Private Account
            </label>
          </div> */}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={validated}
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
