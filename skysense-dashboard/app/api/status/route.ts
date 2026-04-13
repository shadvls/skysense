import { NextResponse } from "next/server";

// In-memory storage (Akan reset jika serverless function restart)
// Untuk permanen, hubungkan ke database seperti Supabase/MongoDB nanti.
let systemState = {
  sensorValue: 1024,
  status: "Kering",
  lastUpdate: new Date().toISOString(),
  // Tambahkan state untuk menyimpan jadwal
  schedule: {
    push: "08:00",
    pull: "16:00",
  },
};

export async function GET() {
  // Berikan header anti-cache agar data selalu fresh
  return NextResponse.json(systemState, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Logika Update:
    // Jika body berisi sensorValue, update status sensor.
    // Jika body berisi schedule, update jadwalnya.
    systemState = {
      ...systemState,
      ...body,
      lastUpdate: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "System state updated successfully",
      data: systemState,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body",
      },
      { status: 400 },
    );
  }
}
