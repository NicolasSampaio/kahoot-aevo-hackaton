// POST /api/rooms/answer - Submit an answer
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility

import { NextResponse } from "next/server";
import { getRoom, setRoom, submitAnswer, updatePlayerScore } from "@/lib/server/roomStore";
import { broadcastToRoom } from "@/lib/server/eventStreams";
import { calculatePoints } from "@/lib/scoring";

interface AnswerRequest {
  code: string;
  playerId: string;
  selectedOption: number;
  timeToAnswer: number;
}

export async function POST(request: Request) {
  try {
    const body: AnswerRequest = await request.json();
    const { code, playerId, selectedOption, timeToAnswer } = body;

    // Validate required fields
    if (!code || !playerId || selectedOption === undefined || timeToAnswer === undefined) {
      return NextResponse.json(
        { error: "Room code, player ID, selected option, and time to answer are required" },
        { status: 400 }
      );
    }

    // Validate selected option
    if (selectedOption < 0 || selectedOption > 3) {
      return NextResponse.json(
        { error: "Invalid answer. Must be 0-3" },
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

    // Check if the game is in playing state
    if (room.status !== "playing") {
      return NextResponse.json(
        { error: "Game is not in progress" },
        { status: 400 }
      );
    }

    // Find the player
    const player = room.players.find((p) => p.id === playerId);
    if (!player) {
      return NextResponse.json(
        { error: "Player not found in room" },
        { status: 404 }
      );
    }

    // Check if player already answered this question
    const currentAnswers = room.answers[room.currentQuestionIndex];
    if (currentAnswers && currentAnswers[playerId] !== undefined) {
      return NextResponse.json(
        { error: "Player has already answered this question" },
        { status: 400 }
      );
    }

    // Get current question
    const currentQuestion = room.questions[room.currentQuestionIndex];
    if (!currentQuestion) {
      return NextResponse.json(
        { error: "No question available" },
        { status: 400 }
      );
    }

    // Calculate points
    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const points = calculatePoints(isCorrect, timeToAnswer, currentQuestion.timeLimit);

    // Store the answer
    submitAnswer(code, playerId, selectedOption, room.currentQuestionIndex);

    // Update player score
    updatePlayerScore(code, playerId, points);

    // Get updated room
    const updatedRoom = getRoom(code);
    if (!updatedRoom) {
      return NextResponse.json(
        { error: "Failed to update room" },
        { status: 500 }
      );
    }

    // Broadcast answer submitted event
    broadcastToRoom(code, {
      type: "answer_submitted",
      payload: {
        playerId,
        questionIndex: room.currentQuestionIndex,
        selectedOption,
        isCorrect,
        points,
        room: updatedRoom,
      },
    });

    return NextResponse.json({
      success: true,
      isCorrect,
      points,
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  }
}
