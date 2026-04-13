"use client";
import React from "react";
import { motion } from "framer-motion";
import useSystemDrift from "@/app/hooks/useSystemDrift";

export default function BackgroundGradient() {
  // Memanggil drift dari hook yang kamu punya
  // amplitude: 40, speed: 0.5
  const drift1 = useSystemDrift(40, 0.5);
  const drift2 = useSystemDrift(60, 0.3);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#020617] overflow-hidden -z-10">
      {/* Orb 1: Biru Terang di Kiri Atas */}
      <motion.div
        style={{ x: drift1.x, y: drift1.y }}
        className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[120px] rounded-full"
      />

      {/* Orb 2: Indigo di Kanan Bawah */}
      <motion.div
        style={{ x: drift2.x, y: drift2.y }}
        className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] bg-indigo-500/5 blur-[150px] rounded-full"
      />

      {/* Grain/Noise Texture (Pastikan ada file noise.png di folder public) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('/noise.png')] mix-blend-soft-light" />

      {/* Grid Pattern halus (Opsional, buat kesan Engineering) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-size-[40px_40px]" />
    </div>
  );
}
