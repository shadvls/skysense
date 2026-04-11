import { sanitizeNumber, sanitizeObject, sanitizeString } from "@/lib/sanitize";

const ALLOWED_KEYS = new Set([
  "sensorValue",
  "status",
  "schedule",
  "lastUpdate",
]);

const SANITIZERS = {
  sensorValue: (v: unknown) => sanitizeNumber(v, 0),
  status: (v: unknown) => sanitizeString(String(v ?? ""), 50),
  schedule: (v: unknown) => v,
  lastUpdate: (v: unknown) => sanitizeString(String(v ?? ""), 32),
};

export function validateStatusBody(body: unknown): Record<string, unknown> {
  return sanitizeObject(body, ALLOWED_KEYS, SANITIZERS);
}
