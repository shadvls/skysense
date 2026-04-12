const REQUIRED_SERVER = [
  "NEXT_PUBLIC_API_URL",
];

const OPTIONAL_SERVER: Record<string, string> = {
  "NEXT_PUBLIC_WS_URL": "ws://localhost:3000/ws/api",
};

type EnvVars = {
  apiUrl: string;
  wsUrl: string;
};

let validated: EnvVars | null = null;

export function getEnv(): EnvVars {
  if (validated) return validated;

  const missing: string[] = [];

  for (const key of REQUIRED_SERVER) {
    if (!process.env[key]) {
      missing.push(key);
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
      "Check .env.local or deployment settings.",
    );
  }

  const vars: EnvVars = {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    wsUrl: process.env.NEXT_PUBLIC_WS_URL || OPTIONAL_SERVER.NEXT_PUBLIC_WS_URL,
  };

  validated = vars;
  return vars;
}
