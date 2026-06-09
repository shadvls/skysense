"use client";
import React from "react";
import { RefreshCw, Smartphone } from "lucide-react";
import useStaggerReveal from "@/app/hooks/useStaggerReveal";
import useMagnetic from "@/app/hooks/useMagnetic";

interface HeaderProps {
  isSending: boolean;
}

export default function DashboardHeader({ isSending }: HeaderProps) {
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
            V2.0
          </span>
        </h1>
        <p className="text-slate-400 flex items-center gap-2 mt-2 font-medium">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          ESP8266 Live Node
        </p>
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
