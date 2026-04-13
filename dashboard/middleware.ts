import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 100;

function getClientIp(request: NextRequest): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "127.0.0.1";
}

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    const preflight = new NextResponse(null, { status: 204 });
    preflight.headers.set("Access-Control-Allow-Origin", "*");
    preflight.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    preflight.headers.set("Access-Control-Allow-Headers", "Content-Type");
    preflight.headers.set("Access-Control-Max-Age", "86400");
    return preflight;
  }

  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  } else if (entry.count >= RATE_LIMIT_MAX) {
    const blockResponse = new NextResponse("Too Many Requests", { status: 429 });
    blockResponse.headers.set("Access-Control-Allow-Origin", "*");
    blockResponse.headers.set("Retry-After", "60");
    return blockResponse;
  } else {
    entry.count++;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[${request.method}] ${request.nextUrl.pathname}`);
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
