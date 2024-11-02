import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-5">Staff Scheduler</h2>
          {children}
        </div>
      </div>
    </div>
  );
}
