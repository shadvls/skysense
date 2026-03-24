import { NextResponse } from "next/server";

const startTime = Date.now();

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "skysense-dashboard",
    uptime: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  });
}
