"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

interface ToastMessage {
  id: number;
  type: "success" | "error";
  message: string;
}

let toastId = 0;
const listeners: ((msg: ToastMessage) => void)[] = [];
const DURATION = 4000;

export function showToast(type: "success" | "error", message: string) {
  const msg: ToastMessage = { id: ++toastId, type, message };
  listeners.forEach((fn) => fn(msg));
}

function ToastItem({ t, onRemove }: { t: ToastMessage; onRemove: (id: number) => void }) {
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);

  useEffect(() => {
    startRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (paused) {
      cancelAnimationFrame(rafRef.current);
      return;
    }
    const tick = () => {
      const e = Date.now() - startRef.current;
      if (e >= DURATION) {
        onRemove(t.id);
        return;
      }
      setElapsed(e);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused, t.id, onRemove]);

  const pct = Math.min((elapsed / DURATION) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); startRef.current = Date.now() - elapsed; }}
      className={`relative flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border backdrop-blur-md overflow-hidden ${
        t.type === "success"
          ? "bg-green-900/80 border-green-500/50 text-green-300"
          : "bg-red-900/80 border-red-500/50 text-red-300"
      }`}
    >
      <span className="relative z-10">
        {t.type === "success" ? <CheckCircle size={18} /> : <XCircle size={18} />}
      </span>
      <span className="relative z-10 text-sm font-medium">{t.message}</span>
      <button onClick={() => onRemove(t.id)} className="relative z-10 ml-2 opacity-60 hover:opacity-100">
        <X size={14} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-1 bg-white/20 transition-none"
        style={{ width: `${100 - pct}%` }}
      />
    </motion.div>
  );
}

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handler = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
    };
    listeners.push(handler);
    return () => {
      const idx = listeners.indexOf(handler);
      if (idx >= 0) listeners.splice(idx, 1);
    };
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} t={t} onRemove={remove} />
        ))}
      </AnimatePresence>
    </div>
  );
}
