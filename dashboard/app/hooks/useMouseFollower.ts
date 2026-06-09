import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useMouseFollower() {
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = followerRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

    const move = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return followerRef;
}
