"use client";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 flex flex-col items-center justify-center p-8">
      <h1 className="text-8xl font-black text-blue-500/30 mb-4">404</h1>
      <p className="text-xl font-medium text-slate-400 mb-8">
        Halaman tidak ditemukan
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all"
      >
        Kembali ke Dashboard
      </Link>
    </main>
  );
}
