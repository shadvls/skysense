import { NextResponse } from "next/server";
import { validateStatusBody } from "./schema";

const startupTime = Date.now();

let systemState: Record<string, unknown> = {
  sensorValue: 1024,
  status: "Kering",
  lastUpdate: new Date().toISOString(),
  schedule: {
    push: "08:00",
    pull: "16:00",
  },
};

export async function GET() {
  const uptime = Date.now() - startupTime;
  const lastUpdate = new Date(systemState.lastUpdate as string).getTime();
  const state = {
    ...systemState,
    online: !isNaN(lastUpdate) && Date.now() - lastUpdate < 10000,
    uptime,
  };

  return NextResponse.json(state, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filtered = validateStatusBody(body);

    systemState = {
      ...systemState,
      ...filtered,
      lastUpdate: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "System state updated successfully",
      data: systemState,
    });
  } catch (error) {
    // Menggunakan prefix underscore (_) atau membuang variabel jika memang tidak butuh log spesifik
    // Di sini saya log ke console untuk mematuhi prinsip observability
    console.error("[API_STATUS_ERROR]:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body or internal processing error",
      },
      { status: 400 },
    );
  }
}
