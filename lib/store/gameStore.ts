// Global game state store using Zustand
// IMPORTANT: This client-side store syncs with the server via SSE
// This architecture is SSE-based for Vercel compatibility

import { create } from "zustand";
import { Room, Player, Question, Answer, RoomStatus } from "@/types/game";

interface GameState {
  // Room state
  room: Room | null;
  players: Player[];
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  answers: Answer[];
  scores: { [playerId: string]: number };
  status: RoomStatus | null;

  // Local player
  localPlayer: Player | null;
  isHost: boolean;

  // Connection state
  isConnected: boolean;
  connectionError: string | null;

  // Actions
  setRoom: (room: Room | null) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  updateGameState: (updates: Partial<GameState>) => void;
  submitAnswer: (answer: Answer) => void;
  updateScores: (scores: { [playerId: string]: number }) => void;
  setLocalPlayer: (player: Player | null) => void;
  setIsHost: (isHost: boolean) => void;
  setConnectionState: (isConnected: boolean, error?: string | null) => void;
  nextQuestion: () => void;
  resetGame: () => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  room: null,
  players: [],
  currentQuestion: null,
  currentQuestionIndex: 0,
  answers: [],
  scores: {},
  status: null,
  localPlayer: null,
  isHost: false,
  isConnected: false,
  connectionError: null,

  // Actions
  setRoom: (room) => {
    set({
      room,
      players: room?.players || [],
      currentQuestionIndex: room?.currentQuestionIndex || 0,
      currentQuestion: room?.questions[room?.currentQuestionIndex || 0] || null,
      scores: room?.scores || {},
      status: room?.status || null,
    });
  },

  addPlayer: (player) => {
    const { players } = get();
    if (!players.find((p) => p.id === player.id)) {
      set({ players: [...players, player] });
    }
  },

  removePlayer: (playerId) => {
    const { players } = get();
    set({ players: players.filter((p) => p.id !== playerId) });
  },

  updatePlayer: (playerId, updates) => {
    const { players } = get();
    set({
      players: players.map((p) =>
        p.id === playerId ? { ...p, ...updates } : p
      ),
    });
  },

  updateGameState: (updates) => {
    set((state) => {
      const newState = { ...state, ...updates };

      // If room is updated, sync related state
      if (updates.room) {
        newState.players = updates.room.players || state.players;
        newState.currentQuestionIndex =
          updates.room.currentQuestionIndex ?? state.currentQuestionIndex;
        newState.currentQuestion =
          updates.room.questions[newState.currentQuestionIndex] ||
          state.currentQuestion;
        newState.scores = updates.room.scores || state.scores;
        newState.status = updates.room.status || state.status;
      }

      return newState;
    });
  },

  submitAnswer: (answer) => {
    const { answers, localPlayer } = get();

    // Add to answers array
    set({ answers: [...answers, answer] });

    // Update local player answers if it's our answer
    if (localPlayer && answer.playerId === localPlayer.id) {
      set({
        localPlayer: {
          ...localPlayer,
          answers: [...localPlayer.answers, answer],
        },
      });
    }
  },

  updateScores: (scores) => {
    set({ scores });

    // Update player scores
    const { players } = get();
    set({
      players: players.map((p) => ({
        ...p,
        score: scores[p.id] ?? p.score,
      })),
    });
  },

  setLocalPlayer: (player) => {
    set({ localPlayer: player });
  },

  setIsHost: (isHost) => {
    set({ isHost });
  },

  setConnectionState: (isConnected, error = null) => {
    set({ isConnected, connectionError: error });
  },

  nextQuestion: () => {
    const { room, currentQuestionIndex } = get();
    if (!room) return;

    const nextIndex = currentQuestionIndex + 1;
    const nextQuestion = room.questions[nextIndex] || null;

    set({
      currentQuestionIndex: nextIndex,
      currentQuestion: nextQuestion,
      answers: [], // Clear answers for new question
    });

    // Broadcast question changed event would be handled by API call
  },

  resetGame: () => {
    set({
      room: null,
      players: [],
      currentQuestion: null,
      currentQuestionIndex: 0,
      answers: [],
      scores: {},
      status: null,
      localPlayer: null,
      isHost: false,
      isConnected: false,
      connectionError: null,
    });
  },
}));

// Selector hooks for performance
export const selectRoom = (state: GameState) => state.room;
export const selectPlayers = (state: GameState) => state.players;
export const selectCurrentQuestion = (state: GameState) => state.currentQuestion;
export const selectLocalPlayer = (state: GameState) => state.localPlayer;
export const selectIsHost = (state: GameState) => state.isHost;
export const selectIsConnected = (state: GameState) => state.isConnected;
export const selectScores = (state: GameState) => state.scores;
export const selectStatus = (state: GameState) => state.status;
