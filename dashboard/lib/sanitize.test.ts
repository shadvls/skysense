import { describe, it, expect } from "vitest";
import { sanitizeString, sanitizeNumber, sanitizeObject } from "./sanitize";

describe("sanitizeString", () => {
  it("trims whitespace", () => {
    expect(sanitizeString("  hello  ")).toBe("hello");
  });

  it("strips dangerous chars", () => {
    expect(sanitizeString('<script>alert("xss")</script>')).toBe("scriptalert(\"xss\")/script");
  });
});

describe("sanitizeNumber", () => {
  it("returns number as-is", () => {
    expect(sanitizeNumber(42, 0)).toBe(42);
  });

  it("parses string numbers", () => {
    expect(sanitizeNumber("42", 0)).toBe(42);
  });

  it("returns fallback for invalid input", () => {
    expect(sanitizeNumber("abc", 10)).toBe(10);
  });
});

describe("sanitizeObject", () => {
  const allowed = new Set(["name", "age"]);

  it("filters unknown keys", () => {
    const result = sanitizeObject({ name: "test", role: "admin" }, allowed);
    expect(result).toEqual({ name: "test" });
  });

  it("returns empty for non-object", () => {
    expect(sanitizeObject(null, allowed)).toEqual({});
    expect(sanitizeObject("string", allowed)).toEqual({});
  });
});
