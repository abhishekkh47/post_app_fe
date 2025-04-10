import React from "react";

interface LoaderProps {
  displayText?: string | null;
}

const Loader: React.FC<LoaderProps> = ({ displayText }) => {
  return (
    <div className="text-center py-4">
      <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      <p className="mt-2 text-gray-600">
        {displayText ? displayText : `Loading...`}
      </p>
    </div>
  );
};

export default Loader;
