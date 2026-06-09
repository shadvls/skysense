import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function useStaggerReveal() {
  const parentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const children = parentRef.current?.children;
    if (!children) return;

    gsap.fromTo(
      children,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: parentRef.current,
          start: "top 90%",
        },
      },
    );
  }, []);

  return parentRef;
}
