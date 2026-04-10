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
  const ip = getClientIp(request);
  const now = Date.now();
  const entry = rateLimit.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
  } else if (entry.count >= RATE_LIMIT_MAX) {
    return new NextResponse("Too Many Requests", { status: 429 });
  } else {
    entry.count++;
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[${request.method}] ${request.nextUrl.pathname}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
