import { NextResponse } from "next/server";

let pendingAction: string | null = null;

export async function GET() {
  if (pendingAction) {
    return NextResponse.json({
      action: pendingAction,
      pending: true,
    });
  }
  return NextResponse.json({ action: null, pending: false });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action !== "push" && action !== "pull") {
      return NextResponse.json(
        { success: false, message: "Invalid action. Use 'push' or 'pull'." },
        { status: 400 },
      );
    }

    pendingAction = action;

    return NextResponse.json({
      success: true,
      message: `Command ${action} stored as pending`,
      action,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid request body" },
      { status: 400 },
    );
  }
}
