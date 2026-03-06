"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./components/sections/DashboardHeader";
import SensorCard from "./components/sections/SensorCard";
import ScheduleCard from "./components/sections/ScheduleCard";

interface ScheduleState {
  push: string;
  pull: string;
}

function loadSchedule(): ScheduleState {
  if (typeof window === "undefined") return { push: "08:00", pull: "16:00" };
  try {
    const saved = localStorage.getItem("skysense-schedule");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { push: "08:00", pull: "16:00" };
}

export default function Dashboard() {
  const [data, setData] = useState({
    sensorValue: 1024,
    status: "Kering",
    online: false,
  });
  const [schedule, setSchedule] = useState<ScheduleState>(loadSchedule);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    localStorage.setItem("skysense-schedule", JSON.stringify(schedule));
  }, [schedule]);

  const fetchWithTimeout = async (url: string, options?: RequestInit, timeout = 5000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  };

  const handleSyncSchedule = async () => {
    try {
      const res = await fetchWithTimeout("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });
      if (!res.ok) throw new Error("Sync failed");
      alert("Schedule synced to cloud!");
    } catch (error) {
      console.error("[SYNC_ERROR]:", error);
      alert("Failed to sync schedule.");
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetchWithTimeout("/api/status");
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("[FETCH_ERROR]:", error);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendCommand = async (cmd: "push" | "pull") => {
    setIsSending(true);
    try {
      const res = await fetch("/api/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: cmd }),
      });

      if (!res.ok) throw new Error("Control failed");

      alert(`Perintah /${cmd} berhasil dikirim!`);
    } catch (error) {
      console.error("[COMMAND_ERROR]:", error);
      alert("Gagal mengirim perintah.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <DashboardHeader isSending={isSending} online={data.online} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorCard data={data} onCommand={sendCommand} />
        <ScheduleCard schedule={schedule} setSchedule={setSchedule} onSync={handleSyncSchedule} />
      </div>
    </main>
  );
}
