import React from "react";

const HomeShimmer: React.FC = () => {
  return (
    <div className="animate-pulse">
      {/* Navbar Shimmer */}
      <div className="bg-gray-300 h-16 w-full mb-6"></div>

      {/* Content Shimmer */}
      <div className="bg-white rounded-md shadow p-4 w-full max-w-xl mx-auto mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="w-1/2 h-4 bg-gray-300 rounded"></div>
            <div className="w-1/3 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>

        <div className="w-full h-4 bg-gray-300 rounded mb-2"></div>
        <div className="w-3/4 h-4 bg-gray-200 rounded mb-4"></div>

        <div className="w-full h-64 bg-gray-300 rounded-md"></div>
      </div>
    </div>
  );
};

export default HomeShimmer;
