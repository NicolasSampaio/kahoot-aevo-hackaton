// GET /api/rooms/[code] - Get room data
// This endpoint is used by the lobby to poll for updates

import { NextResponse } from "next/server";
import { getRoom } from "@/lib/server/roomStore-supabase";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    
    if (!code) {
      return NextResponse.json(
        { error: "Room code is required" },
        { status: 400 }
      );
    }

    const room = await getRoom(code);
    
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Don't broadcast anything via SSE here - this is just a simple GET
    // for polling. SSE events are handled separately via /api/events
    
    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}