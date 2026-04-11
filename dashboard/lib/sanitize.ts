export function sanitizeString(input: string, maxLength = 1024): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>&"'`]/g, "");
}

export function sanitizeNumber(input: unknown, fallback: number): number {
  if (typeof input === "number" && !isNaN(input) && isFinite(input)) {
    return input;
  }
  if (typeof input === "string") {
    const parsed = Number(input);
    if (!isNaN(parsed) && isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

export function sanitizeObject<T extends Record<string, unknown>>(
  input: unknown,
  allowedKeys: Set<string>,
  sanitizers?: Partial<Record<string, (val: unknown) => unknown>>,
): T {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {} as T;
  }
  const result: Record<string, unknown> = {};
  for (const key of Object.keys(input as Record<string, unknown>)) {
    if (!allowedKeys.has(key)) continue;
    const value = (input as Record<string, unknown>)[key];
    if (sanitizers?.[key]) {
      result[key] = sanitizers[key]!(value);
    } else if (typeof value === "string") {
      result[key] = sanitizeString(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
