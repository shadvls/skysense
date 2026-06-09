"use client";

import { useState, useEffect } from "react";

export default function useGlitchEffect(intensity = 1) {
  const [glitch, setGlitch] = useState({ x: 0, skew: 0, opacity: 1 });

  useEffect(() => {
    const triggerGlitch = () => {
      const hasGlitch = Math.random() > 0.95;

      if (hasGlitch) {
        setGlitch({
          x: (Math.random() - 0.5) * 20 * intensity,
          skew: (Math.random() - 0.5) * 10 * intensity,
          opacity: 0.8 + Math.random() * 0.2,
        });
        setTimeout(() => {
          setGlitch({ x: 0, skew: 0, opacity: 1 });
        }, 50);
      }
    };

    const interval = setInterval(triggerGlitch, 150);
    return () => clearInterval(interval);
  }, [intensity]);

  return glitch;
}
