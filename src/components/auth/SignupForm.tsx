import React from "react";
import { Mail, User } from "lucide-react";
import { useSignup } from "../../hooks";
import { useNavigate } from "react-router-dom";
import successGif from "../../assets/success.gif";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SignupForm: React.FC = () => {
  const {
    error,
    formData,
    handleSubmit,
    handleChange,
    signupSuccess,
    handleContactChange,
    firstNameInputRef,
  } = useSignup();
  const navigate = useNavigate();
  let validated = false;

  if (signupSuccess) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
          <img src={successGif} alt="success" className="h-16 w-16 mx-auto" />
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            Signup Successful!
          </h2>
          <p className="text-gray-600 mt-2">
            Thank you for signing up. Please check your mail to update your
            password.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </div>
    );
  }
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
                ref={firstNameInputRef}
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="First Name"
                autoFocus={true}
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
              <PhoneInput
                country={"in"}
                onlyCountries={["in"]}
                value={formData.contact}
                onChange={(phone) => handleContactChange(phone)}
                inputStyle={{
                  width: "100%",
                  height: "42px",
                  fontSize: "14px",
                  paddingLeft: "48px",
                  borderRadius: "0.375rem",
                  border: "1px solid rgb(209, 213, 219)",
                }}
                buttonStyle={{
                  border: "1px solid rgb(209, 213, 219)",
                  borderRight: "none",
                  borderTopLeftRadius: "0.375rem",
                  borderBottomLeftRadius: "0.375rem",
                }}
                containerClass="w-full"
                dropdownStyle={{ maxHeight: "200px", overflow: "auto" }}
              />
            </div>

            <div>
              <div className="block text-sm font-medium text-gray-700 mb-1">
                {/* <Phone className="h-5 w-5 text-gray-500" /> */}
                Gender
              </div>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="M"
                    checked={formData.gender === "M"}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                    required
                  />
                  <span className="text-gray-700">Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="F"
                    checked={formData.gender === "F"}
                    onChange={handleChange}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700">Female</span>
                </label>
              </div>
            </div>

            {formData.email &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                <div className="text-red-500 text-sm">
                  Invalid email address
                </div>
              )}
            {formData.contact &&
              !/(?:\+91|91)?[6-9]\d{9}$/.test(formData.contact) && (
                <div className="text-red-500 text-sm">
                  Invalid contact number
                </div>
              )}

            {
              (validated =
                !/(?:\+91|91)?[6-9]\d{9}$/.test(formData.contact) ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
                !(formData.firstName.length > 0) ||
                !(formData.lastName.length > 0))
            }
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={validated}
            >
              Sign up
            </button>
            <br />
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
