"use client";
import React from "react";
import { RefreshCw, Smartphone, Signal, WifiOff } from "lucide-react";
import useStaggerReveal from "@/app/hooks/useStaggerReveal";
import useMagnetic from "@/app/hooks/useMagnetic";

interface HeaderProps {
  isSending: boolean;
  online: boolean;
}

export default function DashboardHeader({ isSending, online }: HeaderProps) {
  const staggerRef = useStaggerReveal();
  const refreshRef = useMagnetic();
  const syncRef = useMagnetic();

  return (
    <div
      ref={staggerRef}
      className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
    >
      <div>
        <h1 className="text-5xl font-black tracking-tighter bg-linear-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
          SKYSENSE{" "}
          <span className="text-xs font-mono border border-blue-500/50 px-2 py-1 rounded ml-2 text-blue-400">
            v1.0.0
          </span>
        </h1>
        <div className="flex items-center gap-4 mt-2">
          <p className="text-slate-400 flex items-center gap-2 font-medium">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  online ? "bg-green-400" : "bg-red-400"
                }`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  online ? "bg-green-500" : "bg-red-500"
                }`}
              ></span>
            </span>
            {online ? "ESP8266 Live Node" : "ESP8266 Offline"}
          </p>
          {online ? (
            <Signal size={14} className="text-green-500/60" />
          ) : (
            <WifiOff size={14} className="text-red-500/60" />
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <div ref={refreshRef}>
          <button
            onClick={() => window.location.reload()}
            className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700 hover:border-blue-500/50 transition-colors"
          >
            <RefreshCw size={20} className={isSending ? "animate-spin" : ""} />
          </button>
        </div>
        <div ref={syncRef}>
          <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-700 flex items-center gap-3">
            <Smartphone size={20} className="text-blue-400" />
            <span className="text-sm font-bold text-white tracking-widest">
              TELEGRAM SYNC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
