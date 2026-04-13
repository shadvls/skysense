"use client";
import React from "react";
import useMouseFollower from "@/app/hooks/useMouseFollower";

export default function OverlaySystem() {
  // Memanggil hook follower yang sudah ada
  const followerRef = useMouseFollower();

  return (
    <>
      {/* 1. Custom Mouse Follower */}
      <div
        ref={followerRef}
        className="hidden md:block fixed top-0 left-0 w-10 h-10 border border-blue-500/30 rounded-full z-[9999] pointer-events-none mix-blend-difference"
      />

      {/* 2. Global HUD Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        {/* Vignette Gelap di Pinggir */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020617_90%)] opacity-60" />

        {/* Overlay Biru sangat tipis untuk mood IoT */}
        <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />
      </div>
    </>
  );
}
