export type GameState =
  | "waiting"
  | "countdown"
  | "question"
  | "answer-reveal"
  | "leaderboard"
  | "final-results";

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  answers: Answer[];
}

export interface Question {
  id: string;
  text: string;
  options: [string, string, string, string];
  correctOptionIndex: number;
  timeLimit: number;
}

export interface Answer {
  playerId: string;
  questionId: string;
  selectedOption: number | null;
  timeToAnswer: number | null;
  isCorrect: boolean;
  points: number;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  players: Player[];
  questions: Question[];
  status: GameState;
  maxPlayers: number;
  currentQuestionIndex: number;
}

export interface GameSession {
  room: Room;
  localPlayer: Player;
  isHost: boolean;
}
