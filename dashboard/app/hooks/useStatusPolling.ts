"use client";
import { useEffect, useState } from "react";
import type { SensorData } from "@/lib/types";

export default function useStatusPolling(interval = 2000) {
  const [data, setData] = useState<SensorData>({
    sensorValue: 1024,
    status: "Kering",
    lastUpdate: new Date().toISOString(),
    schedule: { push: "08:00", pull: "16:00" },
    online: false,
    uptime: 0,
  });

  useEffect(() => {
    const controller = new AbortController();
    const poll = async () => {
      try {
        const res = await fetch("/api/status", { signal: controller.signal });
        if (!res.ok) throw new Error("Fetch failed");
        const json = await res.json();
        setData(json);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("[FETCH_ERROR]:", error);
        }
      }
    };
    poll();
    const id = setInterval(poll, interval);
    return () => {
      clearInterval(id);
      controller.abort();
    };
  }, [interval]);

  return data;
}
