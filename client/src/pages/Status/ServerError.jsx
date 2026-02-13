import React from "react";
import { useNavigate } from "react-router-dom";

const ServerError = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">500</h1>
      <p className="text-xl text-gray-600 mt-4">Internal Server Error</p>

      <button
        onClick={() => navigate(-1)}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Go Back
      </button>
    </div>
  );
};

export default ServerError;