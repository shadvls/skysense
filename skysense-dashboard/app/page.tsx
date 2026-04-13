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
  Send,
  RefreshCw,
  Settings2,
  Smartphone,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function Dashboard() {
  const [data, setData] = useState({ sensorValue: 1024, status: "Kering" });
  const [schedule, setSchedule] = useState({ push: "08:00", pull: "16:00" });
  const [isSending, setIsSending] = useState(false);
  const sensorRef = useRef(null);

  // Real-time Polling Data Sensor
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

  // GSAP Animation angka
  useEffect(() => {
    gsap.to(sensorRef.current, {
      innerText: data.sensorValue,
      duration: 0.8,
      snap: { innerText: 1 },
      ease: "power2.out",
    });
  }, [data.sensorValue]);

  // Fungsi Kirim Perintah (Push/Pull)
  const sendCommand = async (cmd: "push" | "pull") => {
    setIsSending(true);
    try {
      // Mengirim ke API Route yang nantinya diteruskan ke Telegram Bot API / ESP
      await fetch("/api/control", {
        method: "POST",
        body: JSON.stringify({ action: cmd }),
      });
      alert(`Perintah /${cmd} berhasil dikirim!`);
    } catch (err) {
      alert("Gagal mengirim perintah.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
      >
        <div>
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-r from-blue-400 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            SKYSENSE AI{" "}
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
          <button
            onClick={() => window.location.reload()}
            className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700 hover:bg-slate-700 transition-all"
          >
            <RefreshCw size={20} className={isSending ? "animate-spin" : ""} />
          </button>
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700 flex items-center gap-3">
            <Smartphone size={20} className="text-blue-400" />
            <span className="text-sm font-bold">TELEGRAM SYNC</span>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sensor & Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="md:col-span-2 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl p-8 rounded-[2rem] border border-slate-700 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-10 opacity-10">
            <CloudRain size={200} />
          </div>

          <div className="relative z-10">
            <p className="text-blue-400 uppercase tracking-[0.3em] text-xs font-black mb-2">
              Atmospheric Data
            </p>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center">
              <div>
                <h2
                  ref={sensorRef}
                  className="text-9xl font-black text-white leading-none tracking-tighter"
                >
                  1024
                </h2>
                <p className="text-slate-500 font-medium ml-2 mt-2 italic">
                  Analog Precipitation Index
                </p>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={data.status}
                  initial={{ rotate: -20, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 20, opacity: 0 }}
                  className={`mt-6 md:mt-0 p-10 rounded-[2.5rem] shadow-inner ${data.status === "Basah" ? "bg-blue-500/10" : "bg-yellow-500/10"}`}
                >
                  {data.status === "Basah" ? (
                    <CloudRain
                      size={80}
                      className="text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)]"
                    />
                  ) : (
                    <Sun
                      size={80}
                      className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]"
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <div
                className={`px-8 py-3 rounded-2xl font-black tracking-widest text-sm transition-all duration-500 shadow-lg ${data.status === "Basah" ? "bg-blue-600 shadow-blue-500/20" : "bg-green-600 shadow-green-500/20"}`}
              >
                STATUS: {data.status.toUpperCase()}
              </div>
              <button
                onClick={() => sendCommand("push")}
                className="px-8 py-3 bg-slate-700 hover:bg-blue-600 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                <MoveUp size={18} /> FORCE PUSH
              </button>
              <button
                onClick={() => sendCommand("pull")}
                className="px-8 py-3 bg-slate-700 hover:bg-indigo-600 rounded-2xl font-bold flex items-center gap-2 transition-all active:scale-95"
              >
                <MoveDown size={18} /> FORCE PULL
              </button>
            </div>
          </div>
        </motion.div>

        {/* Control & Schedule Card */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-800/50 backdrop-blur-md p-8 rounded-[2rem] border border-slate-700"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Settings2 className="text-blue-400" size={20} /> Pengaturan Waktu
            </h3>

            <div className="space-y-5">
              <div className="group">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 block group-hover:text-blue-400 transition-colors">
                  Jadwal Jemur (Pagi)
                </label>
                <div className="flex items-center gap-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-700 focus-within:border-blue-500/50 transition-all">
                  <Clock className="text-slate-500" size={20} />
                  <input
                    type="time"
                    value={schedule.push}
                    onChange={(e) =>
                      setSchedule({ ...schedule, push: e.target.value })
                    }
                    className="bg-transparent border-none outline-none text-lg font-bold w-full text-white"
                  />
                </div>
              </div>

              <div className="group">
                <label className="text-[10px] font-bold text-slate-500 uppercase ml-1 mb-2 block group-hover:text-indigo-400 transition-colors">
                  Jadwal Tarik (Sore)
                </label>
                <div className="flex items-center gap-3 p-4 bg-slate-900/80 rounded-2xl border border-slate-700 focus-within:border-indigo-500/50 transition-all">
                  <Clock className="text-slate-500" size={20} />
                  <input
                    type="time"
                    value={schedule.pull}
                    onChange={(e) =>
                      setSchedule({ ...schedule, pull: e.target.value })
                    }
                    className="bg-transparent border-none outline-none text-lg font-bold w-full text-white"
                  />
                </div>
              </div>

              <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-xs tracking-widest flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/10">
                <Send size={16} /> UPDATE SCHEDULE
              </button>
            </div>
          </motion.div>

          {/* Weather Tip Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600/20 border border-indigo-500/30 p-6 rounded-[2rem] flex items-center gap-4"
          >
            <div className="bg-indigo-500 p-3 rounded-xl">
              <CloudRain size={24} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-indigo-300 uppercase">
                Weather Intelligence
              </p>
              <p className="text-sm font-medium">
                Sistem akan otomatis pull jika intensitas di atas threshold.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
