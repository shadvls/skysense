"use client";
import React from "react";
import { motion } from "framer-motion";
import { Clock, Settings2, Send, CloudRain } from "lucide-react";
import useScrollReveal from "@/app/hooks/useScrollReveal";
import useMagnetic from "@/app/hooks/useMagnetic";

// Mendefinisikan interface yang jelas untuk State Schedule
interface ScheduleState {
  push: string;
  pull: string;
}

interface ScheduleProps {
  schedule: ScheduleState;
  setSchedule: (s: ScheduleState) => void;
}

export default function ScheduleCard({ schedule, setSchedule }: ScheduleProps) {
  const revealRef = useScrollReveal();
  const buttonRef = useMagnetic();

  return (
    <div ref={revealRef} className="space-y-6">
      <div className="bg-slate-800/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-slate-700/50 shadow-2xl relative overflow-hidden">
        <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white tracking-tight">
          <Settings2 className="text-blue-500" size={20} /> CHRONO_SETTINGS
        </h3>

        <div className="space-y-6">
          <TimeInput
            label="A.M. Deployment"
            value={schedule.push}
            onChange={(v: string) => setSchedule({ ...schedule, push: v })}
          />
          <TimeInput
            label="P.M. Retraction"
            value={schedule.pull}
            onChange={(v: string) => setSchedule({ ...schedule, pull: v })}
          />

          <div ref={buttonRef}>
            <button className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-[10px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/20 text-white uppercase active:scale-95">
              <Send size={16} /> Sync to Cloud
            </button>
          </div>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-linear-to-r from-indigo-600/20 to-blue-600/10 border border-indigo-500/30 p-8 rounded-[2.5rem] flex items-center gap-5"
      >
        <div className="bg-indigo-500/20 p-4 rounded-2xl border border-indigo-500/50">
          <CloudRain size={24} className="text-indigo-400" />
        </div>
        <div>
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
            System Monitor
          </p>
          <p className="text-sm font-medium text-slate-300 leading-relaxed">
            Auto-retraction active. System monitors precipitation threshold
            24/7.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// Interface untuk Props TimeInput
interface TimeInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
}

function TimeInput({ label, value, onChange }: TimeInputProps) {
  return (
    <div className="group">
      <label className="text-[9px] font-black text-slate-500 uppercase ml-2 mb-2 block group-hover:text-blue-400 transition-colors tracking-widest">
        {label}
      </label>
      <div className="flex items-center gap-4 p-5 bg-slate-900/60 rounded-3xl border border-slate-700 group-focus-within:border-blue-500/50 transition-all">
        <Clock
          className="text-slate-600 group-focus-within:text-blue-400"
          size={20}
        />
        <input
          type="time"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            onChange(e.target.value)
          }
          className="bg-transparent border-none outline-none text-xl font-bold w-full text-white scheme-dark"
        />
      </div>
    </div>
  );
}
