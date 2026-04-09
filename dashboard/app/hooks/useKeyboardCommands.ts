"use client";
import { useEffect, useRef } from "react";

export default function useKeyboardCommands(commands: Record<string, () => void>) {
  const ref = useRef(commands);

  useEffect(() => {
    ref.current = commands;
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const key = e.key.toLowerCase();
      const fn = ref.current[key];
      if (fn) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commands]);
}
