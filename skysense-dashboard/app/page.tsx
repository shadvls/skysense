"use client";
import React, { useEffect, useState } from "react";
import DashboardHeader from "./components/sections/DashboardHeader";
import SensorCard from "./components/sections/SensorCard";
import ScheduleCard from "./components/sections/ScheduleCard";

export default function Dashboard() {
  const [data, setData] = useState({ sensorValue: 1024, status: "Kering" });
  const [schedule, setSchedule] = useState({ push: "08:00", pull: "16:00" });
  const [isSending, setIsSending] = useState(false);

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

  const sendCommand = async (cmd: "push" | "pull") => {
    setIsSending(true);
    try {
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
      <DashboardHeader isSending={isSending} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SensorCard data={data} onCommand={sendCommand} />
        <ScheduleCard schedule={schedule} setSchedule={setSchedule} />
      </div>
    </main>
  );
}
