"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Preloader from "./Preloader";
import OverlaySystem from "./OverlaySystem";
import BackgroundGradient from "./BackgroundGradient";
import Toast from "./Toast";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulasi loading agar animasi Preloader selesai dengan sempurna
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Background & Overlay dirender di luar AnimatePresence agar selalu aktif */}
      <BackgroundGradient />
      <OverlaySystem />
      <Toast />

      <AnimatePresence mode="wait">
        {loading ? (
          /* Layer 1: Preloader */
          <Preloader key="preloader" />
        ) : (
          /* Layer 2: Main Content dengan transisi Fade-in */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative z-10"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
