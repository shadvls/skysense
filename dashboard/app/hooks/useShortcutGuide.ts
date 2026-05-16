"use client";
import { useEffect } from "react";

const RESERVED_SHORTCUTS = [
  { key: "p", action: "pull", label: "Pull laundry in" },
  { key: "d", action: "push", label: "Deploy / push out" },
];

export default function useShortcutGuide() {
  useEffect(() => {
    const guide = document.createElement("div");
    guide.id = "shortcut-guide";
    guide.className =
      "fixed bottom-4 left-4 z-40 flex gap-2 text-[10px] font-mono text-slate-500 pointer-events-none";
    guide.innerHTML = RESERVED_SHORTCUTS
      .map((s) => `<kbd class="px-2 py-1 rounded-md bg-slate-800 border border-slate-700">${s.key.toUpperCase()}</kbd> <span>${s.label}</span>`)
      .join(" &nbsp;| ");
    document.body.appendChild(guide);
    return () => guide.remove();
  }, []);
}
