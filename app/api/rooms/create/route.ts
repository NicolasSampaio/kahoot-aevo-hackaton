// POST /api/rooms/create - Create a new room
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { setRoom, generateRoomCode } from "@/lib/server/roomStore";
import { broadcastToRoom } from "@/lib/server/eventStreams";
import { Room, Player } from "@/types/game";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, maxPlayers = 10, questions: submittedQuestions = [] } = body;

    if (!playerName || typeof playerName !== "string") {
      return NextResponse.json(
        { error: "Player name is required" },
        { status: 400 }
      );
    }

    // Generate a unique room code
    const code = generateRoomCode();

    // Create host player
    const hostId = uuidv4();
    const host: Player = {
      id: hostId,
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`,
      score: 0,
      answers: [],
      isHost: true,
    };

    // Create new room
    const room: Room = {
      id: uuidv4(),
      code,
      hostId,
      players: [host],
      questions: [],
      status: "lobby",
      maxPlayers,
      currentQuestionIndex: 0,
      answers: {},
      scores: { [hostId]: 0 },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Store room
    setRoom(code, room);

    // Broadcast room created event (though there shouldn't be any listeners yet)
    broadcastToRoom(code, {
      type: "room_created",
      payload: { room, player: host },
    });

    return NextResponse.json({
      success: true,
      code,
      room,
      player: host,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json(
      { error: "Failed to create room" },
      { status: 500 }
    );
  }
}
