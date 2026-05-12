import { describe, it, expect } from "vitest";
import { formatSensorValue, formatPercentage, formatDuration } from "./format";

describe("formatSensorValue", () => {
  it("formats small numbers", () => {
    expect(formatSensorValue(42)).toBe("42");
  });

  it("formats thousands", () => {
    expect(formatSensorValue(1500)).toBe("1.5k");
  });
});

describe("formatPercentage", () => {
  it("rounds to integer", () => {
    expect(formatPercentage(75.3)).toBe("75%");
  });
});

describe("formatDuration", () => {
  it("formats seconds", () => {
    expect(formatDuration(5000)).toBe("5s");
  });

  it("formats minutes", () => {
    expect(formatDuration(120000)).toBe("2m 0s");
  });

  it("formats hours", () => {
    expect(formatDuration(7200000)).toBe("2h 0m");
  });

  it("formats days", () => {
    expect(formatDuration(90000000)).toBe("1d 1h");
  });
});
