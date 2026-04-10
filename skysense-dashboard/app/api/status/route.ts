import { NextResponse } from 'next/server';

// In-memory storage (untuk demo, idealnya pakai Redis/Database)
let deviceStatus = {
  sensorValue: 1024,
  status: "Kering",
  lastUpdate: new Date().toISOString()
};

export async function GET() {
  return NextResponse.json(deviceStatus);
}

export async function POST(request: Request) {
  const body = await request.json();
  deviceStatus = {
    ...body,
    lastUpdate: new Date().toISOString()
  };
  return NextResponse.json({ success: true });
}