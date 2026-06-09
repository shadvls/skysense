"use client";

import { useMotionValue, useAnimationFrame } from "framer-motion";

export default function useSystemDrift(amplitude = 5, speed = 1) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useAnimationFrame((time) => {
    // Kalkulasi matematika untuk gerakan organik (Lissajous curve style)
    const moveX = Math.sin(time * 0.001 * speed) * amplitude;
    const moveY = Math.cos(time * 0.0012 * speed) * (amplitude * 0.5);

    x.set(moveX);
    y.set(moveY);
  });

  return { x, y };
}
