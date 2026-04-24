"use client";
import React, { useEffect, useState, useCallback } from "react";
import DashboardHeader from "./components/sections/DashboardHeader";
import SensorCard from "./components/sections/SensorCard";
import ScheduleCard from "./components/sections/ScheduleCard";
import useStatusPolling from "./hooks/useStatusPolling";
import { showToast } from "./components/shared/Toast";
import type { ScheduleState } from "@/lib/types";

function loadSchedule(): ScheduleState {
  if (typeof window === "undefined") return { push: "08:00", pull: "16:00" };
  try {
    const saved = localStorage.getItem("skysense-schedule");
    if (saved) return JSON.parse(saved);
  } catch {}
  return { push: "08:00", pull: "16:00" };
}

export default function Dashboard() {
  const data = useStatusPolling(2000);
  const [schedule, setSchedule] = useState<ScheduleState>(loadSchedule);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    localStorage.setItem("skysense-schedule", JSON.stringify(schedule));
  }, [schedule]);

  const handleSyncSchedule = useCallback(async () => {
    try {
      const res = await fetch("/api/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });
      if (!res.ok) throw new Error("Sync failed");
      showToast("success", "Schedule synced to cloud!");
    } catch (error) {
      console.error("[SYNC_ERROR]:", error);
      showToast("error", "Failed to sync schedule.");
    }
  }, [schedule]);

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
    <main id="main-content" className="min-h-screen bg-[#020617] text-slate-100 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <DashboardHeader isSending={isSending} online={data.online} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorCard data={data} onCommand={sendCommand} />
        <ScheduleCard schedule={schedule} setSchedule={setSchedule} onSync={handleSyncSchedule} />
      </div>
    </main>
  );
}
