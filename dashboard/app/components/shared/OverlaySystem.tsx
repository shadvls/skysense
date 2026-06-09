"use client";
import React from "react";
import useMouseFollower from "@/app/hooks/useMouseFollower";

export default function OverlaySystem() {
  const followerRef = useMouseFollower();

  return (
    <>
      {/* 1. Custom Mouse Follower */}
      <div
        ref={followerRef}
        className="hidden md:block fixed top-0 left-0 w-10 h-10 border border-blue-400/40 rounded-full z-9999 pointer-events-none mix-blend-screen"
      />

      {/* 2. Global HUD Overlay - Dioptimalkan agar tidak menggelapkan pojok */}
      <div className="fixed inset-0 pointer-events-none z-9998">
        {/* HAPUS: Vignette Radial Gradient sudah dibuang total dari sini */}

        {/* Scanline halus (Opsional: kasih vibe monitor high-tech tanpa menggelapkan) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,0,0.02))] bg-size-[100%_4px,3px_100%] opacity-20" />

        {/* Ambient Blue Tint - Memberikan mood IoT tanpa menutupi konten */}
        <div className="absolute inset-0 bg-blue-500/2 mix-blend-screen" />
      </div>
    </>
  );
}
