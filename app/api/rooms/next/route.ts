// POST /api/rooms/next - Move to next question
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility

import { NextResponse } from "next/server";
import { getRoom, setRoom, nextQuestion, setRoomStatus } from "@/lib/server/roomStore";
import { broadcastToRoom } from "@/lib/server/eventStreams";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, playerId } = body;

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
        { error: "Only the host can advance questions" },
        { status: 403 }
      );
    }

    // Check if game is in playing state
    if (room.status !== "playing") {
      return NextResponse.json(
        { error: "Game is not in progress" },
        { status: 400 }
      );
    }

    // Check if there are more questions
    const nextIndex = room.currentQuestionIndex + 1;
    if (nextIndex >= room.questions.length) {
      // No more questions, finish the game
      const updatedRoom = setRoomStatus(code, "results");
      if (!updatedRoom) {
        return NextResponse.json(
          { error: "Failed to finish game" },
          { status: 500 }
        );
      }

      // Broadcast game finished event
      broadcastToRoom(code, {
        type: "game_finished",
        payload: {
          room: updatedRoom,
          finalScores: updatedRoom.scores,
        },
      });

      return NextResponse.json({
        success: true,
        finished: true,
        room: updatedRoom,
      });
    }

    // Move to next question
    const updatedRoom = nextQuestion(code);
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Failed to advance question" },
        { status: 500 }
      );
    }

    // Broadcast question changed event
    broadcastToRoom(code, {
      type: "question_changed",
      payload: {
        questionIndex: nextIndex,
        room: updatedRoom,
      },
    });

    return NextResponse.json({
      success: true,
      questionIndex: nextIndex,
      room: updatedRoom,
    });
  } catch (error) {
    console.error("Error advancing question:", error);
    return NextResponse.json(
      { error: "Failed to advance question" },
      { status: 500 }
    );
  }
}
