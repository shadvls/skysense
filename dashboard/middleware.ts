import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  if (process.env.NODE_ENV === "development") {
    console.log(
      `[${request.method}] ${request.nextUrl.pathname}`,
    );
  }

  return response;
}

export const config = {
  matcher: "/api/:path*",
};
