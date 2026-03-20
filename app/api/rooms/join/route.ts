// POST /api/rooms/join - Join an existing room
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility

import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getRoom, setRoom, addPlayerToRoom } from "@/lib/server/roomStore";
import { broadcastToRoom } from "@/lib/server/eventStreams";
import { Player } from "@/types/game";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, playerName } = body;

    if (!code || !playerName) {
      return NextResponse.json(
        { error: "Room code and player name are required" },
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

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return NextResponse.json(
        { error: "Room is full" },
        { status: 400 }
      );
    }

    // Check if game has already started
    if (room.status === "playing") {
      return NextResponse.json(
        { error: "Game has already started" },
        { status: 400 }
      );
    }

    // Create new player
    const newPlayer: Player = {
      id: uuidv4(),
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${playerName}`,
      score: 0,
      answers: [],
      isHost: false,
    };

    // Add player to room
    try {
      const updatedRoom = addPlayerToRoom(code, newPlayer);
      if (!updatedRoom) {
        return NextResponse.json(
          { error: "Failed to join room" },
          { status: 500 }
        );
      }

      // Broadcast player joined event to all connected clients
      broadcastToRoom(code, {
        type: "player_joined",
        payload: {
          player: newPlayer,
          room: updatedRoom,
        },
      });

      return NextResponse.json({
        success: true,
        room: updatedRoom,
        player: newPlayer,
      });
    } catch (error) {
      if (error instanceof Error && error.message === "Player name already taken") {
        return NextResponse.json(
          { error: "Player name already taken" },
          { status: 400 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Error joining room:", error);
    return NextResponse.json(
      { error: "Failed to join room" },
      { status: 500 }
    );
  }
}
