"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  CloudRain,
  Sun,
  Clock,
  Wifi,
  Power,
  MoveUp,
  MoveDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function Dashboard() {
  const [data, setData] = useState({ sensorValue: 1024, status: "Kering" });
  const sensorRef = useRef(null);

  // Real-time Polling
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/status");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Failed to fetch data");
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // GSAP Animation untuk angka sensor
  useEffect(() => {
    gsap.to(sensorRef.current, {
      innerText: data.sensorValue,
      duration: 1,
      snap: { innerText: 1 },
      ease: "power3.out",
    });
  }, [data.sensorValue]);

  return (
    <main className="min-h-screen bg-[#0f172a] text-slate-100 p-4 md:p-10 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            SKYSENSE AI
          </h1>
          <p className="text-slate-400 flex items-center gap-2 mt-1">
            <Wifi size={16} className="text-green-500" /> System Online
          </p>
        </div>
        <div className="bg-slate-800 p-3 rounded-full">
          <Power className="text-red-400" size={24} />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Status Card */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="md:col-span-2 bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 uppercase tracking-widest text-sm font-bold">
                Intensitas Sensor
              </p>
              <h2
                ref={sensorRef}
                className="text-8xl font-black mt-2 text-white"
              >
                1024
              </h2>
            </div>
            <AnimatePresence mode="wait">
              {data.status === "Basah" ? (
                <motion.div
                  key="rain"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="p-4 bg-blue-500/20 rounded-2xl"
                >
                  <CloudRain size={64} className="text-blue-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="p-4 bg-yellow-500/20 rounded-2xl"
                >
                  <Sun size={64} className="text-yellow-400" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex gap-4">
            <div
              className={`px-6 py-2 rounded-full font-bold transition-colors ${data.status === "Basah" ? "bg-red-500 text-white" : "bg-green-500 text-white"}`}
            >
              STATUS: {data.status.toUpperCase()}
            </div>
          </div>
        </motion.div>

        {/* Scheduling Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Clock className="text-blue-400" /> Penjadwalan
          </h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3">
                <MoveUp className="text-green-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">
                    Jemur (Push)
                  </p>
                  <p className="font-bold text-lg">08:00 AM</p>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-6 h-6 accent-blue-500"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-700">
              <div className="flex items-center gap-3">
                <MoveDown className="text-red-400" />
                <div>
                  <p className="text-xs text-slate-400 uppercase">
                    Tarik (Pull)
                  </p>
                  <p className="font-bold text-lg">04:00 PM</p>
                </div>
              </div>
              <input
                type="checkbox"
                defaultChecked
                className="w-6 h-6 accent-blue-500"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
