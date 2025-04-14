import React from "react";

const MaintenancePageLayout: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          We'll Be Back Soon!
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Our site is currently undergoing scheduled maintenance. Please check
          back later.
        </p>

        {/* You can replace this with your own graphic */}
        <div className="mb-6">
          <img
            src="https://res.cloudinary.com/dwinhws99/image/upload/v1744612215/maintenanceMode_caensi.gif" // Add your own image here
            alt="Maintenance"
            className="mx-auto w-48 h-48 object-cover"
          />
        </div>

        <p className="text-sm text-gray-500">Thank you for your patience!</p>
      </div>
    </div>
  );
};

export default MaintenancePageLayout;
