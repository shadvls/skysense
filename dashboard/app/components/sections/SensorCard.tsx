"use client";
import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudRain, Sun, MoveUp, MoveDown } from "lucide-react";
import gsap from "gsap";
import useMouseProximity from "@/app/hooks/useMouseProximity";
import useGlitchEffect from "@/app/hooks/useGlitchEffect";

interface SensorProps {
  data: { sensorValue: number; status: string; online: boolean };
  onCommand: (cmd: "push" | "pull") => void;
}

export default function SensorCard({ data, onCommand }: SensorProps) {
  const sensorRef = useRef(null);
  const { pushX, pushY } = useMouseProximity();
  const glitch = useGlitchEffect(data.status === "Basah" ? 1.2 : 0.3);

  useEffect(() => {
    if (sensorRef.current) {
      gsap.to(sensorRef.current, {
        innerText: data.sensorValue,
        duration: 1.5,
        snap: { innerText: 1 },
        ease: "expo.out",
      });
    }
  }, [data.sensorValue]);

  if (!data.online) {
    return (
      <motion.div className="md:col-span-2 bg-slate-900/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] border border-red-500/20 shadow-2xl relative overflow-hidden group min-h-112.5 flex flex-col justify-center items-center">
        <div className="relative z-10 text-center">
          <div className="relative mb-6">
            <CloudRain size={80} className="text-red-500/50 mx-auto" />
            <div className="absolute -inset-4 bg-red-500/10 blur-2xl rounded-full"></div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black text-red-500/80 mb-2">
            OFFLINE
          </h2>
          <p className="text-red-400/60 font-mono text-xs tracking-widest uppercase">
            No signal from ESP8266
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{ x: pushX, y: pushY }}
      className="md:col-span-2 bg-slate-900/60 backdrop-blur-2xl p-6 md:p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group min-h-112.5 flex flex-col justify-between"
    >
      <div className="absolute -top-10 -right-10 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none">
        <CloudRain size={300} />
      </div>

      <div className="relative z-10 w-full">
        <p className="text-blue-500 uppercase tracking-[0.4em] text-[9px] font-black mb-6 opacity-80">
          Atmospheric Live Feed
        </p>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div
            style={{
              opacity: glitch.opacity,
              transform: `skewX(${glitch.skew}deg)`,
            }}
            className="relative"
          >
            <h2
              ref={sensorRef}
              className="text-5xl sm:text-7xl md:text-[10rem] font-black text-white leading-none tracking-tighter inline-block break-all"
            >
              0
            </h2>
            <p className="text-slate-500 font-mono text-[10px] tracking-widest mt-2 uppercase">
              Precipitation_Index_Raw
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={data.status}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 1.1, opacity: 0, y: -20 }}
              className={`p-8 md:p-10 rounded-[2.5rem] flex items-center justify-center ${
                data.status === "Basah" ? "bg-blue-500/10" : "bg-yellow-500/10"
              }`}
            >
              {data.status === "Basah" ? (
                <CloudRain
                  size={64}
                  className="text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]"
                />
              ) : (
                <Sun
                  size={64}
                  className="text-yellow-400 drop-shadow-[0_0_20px_rgba(250,204,21,0.5)]"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 mt-10">
        <div className="flex flex-wrap gap-3 md:gap-4">
          <div
            className={`px-6 py-3 rounded-xl font-black text-[10px] tracking-[0.2em] border transition-all duration-700 ${
              data.status === "Basah"
                ? "bg-blue-600/20 border-blue-500/50 text-blue-400"
                : "bg-green-600/20 border-green-500/50 text-green-400"
            }`}
          >
            SYSTEM_READY: {data.status.toUpperCase()}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => onCommand("push")}
              className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white hover:text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10"
            >
              <MoveUp size={14} /> FORCE_PUSH
            </button>
            <button
              onClick={() => onCommand("pull")}
              className="flex-1 md:flex-none px-6 py-3 bg-white/5 hover:bg-white hover:text-black rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border border-white/10"
            >
              <MoveDown size={14} /> FORCE_PULL
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
