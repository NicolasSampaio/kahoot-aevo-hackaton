// POST /api/rooms/start - Start the game
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility

import { NextResponse } from "next/server";
import { getRoom, setRoom, setRoomStatus, setRoomQuestions } from "@/lib/server/roomStore";
import { broadcastToRoom } from "@/lib/server/eventStreams";
import { Question } from "@/types/game";
import { generateSampleQuestions } from "@/lib/game-logic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, playerId, questions } = body;

    if (!code || !playerId) {
      return NextResponse.json(
        { error: "Room code and player ID are required" },
        { status: 400 }
      );
    }

    const room = getRoom(code);
    if (!room) {
      return NextResponse.json(
        { error: "Room not found" },
        { status: 404 }
      );
    }

    // Verify player is the host
    if (room.hostId !== playerId) {
      return NextResponse.json(
        { error: "Only the host can start the game" },
        { status: 403 }
      );
    }

    // Check if game already started
    if (room.status === "playing") {
      return NextResponse.json(
        { error: "Game has already started" },
        { status: 400 }
      );
    }

    // Check minimum players
    if (room.players.length < 1) {
      return NextResponse.json(
        { error: "Need at least 1 player to start" },
        { status: 400 }
      );
    }

    // Set questions (use provided or generate sample)
    const gameQuestions: Question[] = questions || generateSampleQuestions();
    setRoomQuestions(code, gameQuestions);

    // Update room status to playing
    const updatedRoom = setRoomStatus(code, "playing");
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Failed to start game" },
        { status: 500 }
      );
    }

    // Broadcast game started event
    broadcastToRoom(code, {
      type: "game_started",
      payload: {
        room: updatedRoom,
        questions: gameQuestions,
      },
    });

    return NextResponse.json({
      success: true,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    );
  }
}
