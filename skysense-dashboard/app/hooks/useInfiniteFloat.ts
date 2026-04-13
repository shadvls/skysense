import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useInfiniteFloat(duration: number = 3) {
  const floatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = floatRef.current;
    if (!el) return;

    gsap.to(el, {
      y: -15,
      duration: duration,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, [duration]);

  return floatRef;
}
