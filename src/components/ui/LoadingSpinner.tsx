import React from "react";

interface Props {
  message?: string;
}

const LoadingSpinner: React.FC<Props> = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-3">
    <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
    {message && <p className="text-sm text-gray-400">{message}</p>}
  </div>
);

export default LoadingSpinner;
