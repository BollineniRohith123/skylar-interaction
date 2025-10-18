import React, { ReactNode, useState } from 'react';

interface CallStatusProps {
  status: string;
  children?: ReactNode;
}

const CallStatus: React.FC<CallStatusProps> = ({ status, children }) => {
  return (
    <div className="flex flex-col bg-gradient-dark border border-gray-700 rounded-lg p-6 w-full lg:w-1/3 shadow-xl">
      <div className="mt-2">
        <h2 className="text-2xl font-bold mb-4 text-gradient-sky">Call Status</h2>
        <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
          <p className="text-sm font-mono text-gray-400 mb-1">Status</p>
          <p className="text-xl font-bold text-white">{status}</p>
        </div>
        {/* TODO <p className="font-mono text-gray-400">Latency: <span className="text-gray-500">N/A</span></p> */}
        {/* TODO <p className="font-mono">00:00</p> */}
      </div>

      {/* Optional Children */}
      {children}
    </div>
  );
};

export default CallStatus;