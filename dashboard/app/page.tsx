"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./components/sections/DashboardHeader";
import SensorCard from "./components/sections/SensorCard";
import ScheduleCard from "./components/sections/ScheduleCard";

interface ScheduleState {
  push: string;
  pull: string;
}

export default function Dashboard() {
  const [data, setData] = useState({
    sensorValue: 1024,
    status: "Kering",
    online: false,
  });
  const [schedule, setSchedule] = useState<ScheduleState>({
    push: "08:00",
    pull: "16:00",
  });
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/status");
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
        <ScheduleCard schedule={schedule} setSchedule={setSchedule} />
      </div>
    </main>
  );
}
