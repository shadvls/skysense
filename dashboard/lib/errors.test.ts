import { describe, it, expect } from "vitest";
import { AppError, ValidationError } from "./errors";

describe("AppError", () => {
  it("creates error with defaults", () => {
    const err = new AppError("test");
    expect(err.message).toBe("test");
    expect(err.statusCode).toBe(500);
    expect(err.code).toBeUndefined();
  });
});

describe("ValidationError", () => {
  it("creates validation error", () => {
    const err = new ValidationError("invalid");
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("VALIDATION_ERROR");
  });
});
