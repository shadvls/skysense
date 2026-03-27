const ALLOWED_KEYS = new Set([
  "sensorValue",
  "status",
  "schedule",
  "lastUpdate",
]);

export function validateStatusBody(body: unknown): Record<string, unknown> {
  if (!body || typeof body !== "object") {
    throw new Error("Payload is not a valid object");
  }
  const filtered: Record<string, unknown> = {};
  for (const key of Object.keys(body as Record<string, unknown>)) {
    if (ALLOWED_KEYS.has(key)) {
      filtered[key] = (body as Record<string, unknown>)[key];
    }
  }
  return filtered;
}
