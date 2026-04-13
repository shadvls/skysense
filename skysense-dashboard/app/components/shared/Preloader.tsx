"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CloudRain } from "lucide-react";
import gsap from "gsap";

export default function Preloader() {
  useEffect(() => {
    // Animasi GSAP untuk transisi keluar
    const tl = gsap.timeline();
    tl.to(".preloader-text", {
      opacity: 0,
      y: -20,
      delay: 2,
      duration: 0.5,
    }).to(".preloader-bg", {
      height: 0,
      duration: 1,
      ease: "expo.inOut",
    });
  }, []);

  return (
    <div className="preloader-bg fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#020617] overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="preloader-text flex flex-col items-center"
      >
        <div className="relative">
          <CloudRain size={64} className="text-blue-500 mb-4 animate-bounce" />
          <div className="absolute -inset-2 bg-blue-500/20 blur-xl rounded-full"></div>
        </div>

        <h2 className="text-2xl font-black tracking-[0.5em] text-white uppercase">
          SkySense <span className="text-blue-500">AI</span>
        </h2>

        <div className="mt-4 h-[2px] w-48 bg-slate-800 relative overflow-hidden">
          <motion.div
            initial={{ left: "-100%" }}
            animate={{ left: "100%" }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          />
        </div>
        <p className="mt-4 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
          Initializing Neural Link...
        </p>
      </motion.div>
    </div>
  );
}
