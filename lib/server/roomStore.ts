// In-memory room store for MVP
// IMPORTANT: This is ONLY for MVP and NOT production-ready
// - Not persistent
// - Not safe across multiple instances
// - Will reset on redeploy
// For production: use Redis / database or Ably / Pusher / Supabase Realtime
// This architecture is SSE-based for Vercel compatibility

import { Room, Player, Question } from "@/types/game";

const rooms = new Map<string, Room>();

export function getRoom(code: string): Room | undefined {
  return rooms.get(code);
}

export function setRoom(code: string, room: Room): void {
  rooms.set(code, room);
}

export function deleteRoom(code: string): void {
  rooms.delete(code);
}

export function getAllRooms(): Room[] {
  return Array.from(rooms.values());
}

export function addPlayerToRoom(code: string, player: Player): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  // Check for duplicate player name (case-insensitive)
  const duplicate = room.players.some(
    (p) => p.name.toLowerCase() === player.name.toLowerCase()
  );
  if (duplicate) {
    throw new Error("Player name already taken");
  }

  room.players.push(player);
  room.updatedAt = new Date();
  return room;
}

export function removePlayerFromRoom(
  code: string,
  playerId: string
): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  room.players = room.players.filter((p) => p.id !== playerId);
  room.updatedAt = new Date();
  return room;
}

export function updatePlayerScore(
  code: string,
  playerId: string,
  points: number
): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  const player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.score += points;
    room.scores[playerId] = player.score;
  }
  room.updatedAt = new Date();
  return room;
}

export function setRoomQuestions(
  code: string,
  questions: Question[]
): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  room.questions = questions;
  room.updatedAt = new Date();
  return room;
}

export function nextQuestion(code: string): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  room.currentQuestionIndex++;
  room.updatedAt = new Date();
  return room;
}

export function submitAnswer(
  code: string,
  playerId: string,
  answer: number,
  questionIndex: number
): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  if (!room.answers[questionIndex]) {
    room.answers[questionIndex] = {};
  }
  room.answers[questionIndex][playerId] = answer;
  room.updatedAt = new Date();
  return room;
}

export function setRoomStatus(
  code: string,
  status: Room["status"]
): Room | undefined {
  const room = rooms.get(code);
  if (!room) return undefined;

  room.status = status;
  room.updatedAt = new Date();
  return room;
}

// Generate a unique 6-character room code
export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  // Ensure uniqueness
  if (rooms.has(code)) {
    return generateRoomCode();
  }

  return code;
}