"use client";
import React from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-6xl font-black text-red-500/30 mb-4">
        Something went wrong
      </h1>
      <p className="text-slate-400 font-mono text-sm mb-8 max-w-md text-center">
        {error.message || "An unexpected error occurred"}
      </p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all"
      >
        Try again
      </button>
    </div>
  );
}
