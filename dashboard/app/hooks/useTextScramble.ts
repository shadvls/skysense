import { useCallback } from "react";

export default function useTextScramble() {
  const chars = "!<>-_\\/[]{}=+*^?#________";

  const scramble = useCallback((text: string, setText: (t: string) => void) => {
    let frame = 0;
    const totalFrames = 30;
    const originalText = text;

    const update = () => {
      const output = originalText
        .split("")
        .map((char, i) => {
          if (i < (frame / totalFrames) * originalText.length) {
            return char;
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join("");

      setText(output);

      if (frame < totalFrames) {
        frame++;
        requestAnimationFrame(update);
      } else {
        setText(originalText);
      }
    };

    update();
  }, []);

  return scramble;
}
