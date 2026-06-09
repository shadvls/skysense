import { useMemo } from "react";

export default function useSplitText(text: string) {
  return useMemo(() => {
    return text.split("").map((char, index) => ({
      char: char === " " ? "\u00A0" : char,
      index,
    }));
  }, [text]);
}