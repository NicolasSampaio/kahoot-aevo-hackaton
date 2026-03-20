// Supabase-based room store for production use
// This replaces the in-memory store for compatibility with serverless environments

import { Room, Player, Question } from "@/types/game";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

function supabaseRoomToRoom(supabaseRoom: any): Room {
  return {
    id: supabaseRoom.id,
    code: supabaseRoom.code,
    hostId: supabaseRoom.host_id,
    players: supabaseRoom.players || [],
    questions: supabaseRoom.questions || [],
    status: supabaseRoom.status,
    maxPlayers: supabaseRoom.max_players,
    currentQuestionIndex: supabaseRoom.current_question_index || 0,
    scores: supabaseRoom.scores || {},
    answers: supabaseRoom.answers || {},
    createdAt: new Date(supabaseRoom.created_at),
    updatedAt: new Date(supabaseRoom.updated_at),
  };
}

export async function getRoom(code: string): Promise<Room | undefined> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !data) return undefined;
  return supabaseRoomToRoom(data);
}

export async function setRoom(code: string, room: Room): Promise<void> {
  const { error } = await supabase.from("rooms").upsert([
    {
      id: room.id,
      code: code.toUpperCase(),
      host_id: room.hostId,
      status: room.status,
      max_players: room.maxPlayers,
      current_question_index: room.currentQuestionIndex,
      scores: room.scores,
      answers: room.answers,
      questions: room.questions,
      players: room.players,
      updated_at: new Date().toISOString(),
    },
  ]);

  if (error) throw new Error(`Failed to save room: ${error.message}`);
}

export async function deleteRoom(code: string): Promise<void> {
  const { error } = await supabase.from("rooms").delete().eq("code", code.toUpperCase());
  if (error) throw new Error(`Failed to delete room: ${error.message}`);
}

export async function addPlayerToRoom(
  code: string,
  player: Player
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  const duplicate = room.players.some(
    (p) => p.name.toLowerCase() === player.name.toLowerCase()
  );
  if (duplicate) {
    throw new Error("Player name already taken");
  }

  room.players.push(player);
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function removePlayerFromRoom(
  code: string,
  playerId: string
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  room.players = room.players.filter((p) => p.id !== playerId);
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function updatePlayerScore(
  code: string,
  playerId: string,
  points: number
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  const player = room.players.find((p) => p.id === playerId);
  if (player) {
    player.score += points;
    room.scores[playerId] = player.score;
  }
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function setRoomQuestions(
  code: string,
  questions: Question[]
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  room.questions = questions;
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function nextQuestion(code: string): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  room.currentQuestionIndex++;
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function submitAnswer(
  code: string,
  playerId: string,
  answer: number,
  questionIndex: number
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  if (!room.answers[questionIndex]) {
    room.answers[questionIndex] = {};
  }
  room.answers[questionIndex][playerId] = answer;
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function setRoomStatus(
  code: string,
  status: Room["status"]
): Promise<Room | undefined> {
  const room = await getRoom(code);
  if (!room) return undefined;

  room.status = status;
  room.updatedAt = new Date();

  await setRoom(code, room);
  return room;
}

export async function getAllRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from("rooms").select("*");

  if (error) throw new Error(`Failed to fetch rooms: ${error.message}`);
  return data.map(supabaseRoomToRoom);
}

export async function generateRoomCode(): Promise<string> {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";

  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const existingRoom = await getRoom(code);
  if (existingRoom) {
    return generateRoomCode();
  }

  return code;
}
