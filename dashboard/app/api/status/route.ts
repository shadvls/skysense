import { NextResponse } from "next/server";

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
  const state = {
    ...systemState,
    online:
      Date.now() - new Date(systemState.lastUpdate as string).getTime() <
      10000,
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

    // Validasi sederhana untuk memastikan integritas data
    if (!body || typeof body !== "object") {
      throw new Error("Payload is not a valid object");
    }

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
