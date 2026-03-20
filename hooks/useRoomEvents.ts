// SSE client hook for real-time room events
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility
// For production: use Redis / database or Ably / Pusher / Supabase Realtime

import { useEffect, useRef, useCallback, useState } from "react";
import { useGameStore } from "@/lib/store/gameStore";
import { Room, Player, Answer } from "@/types/game";

type SSEEventType =
  | "initial_state"
  | "player_joined"
  | "game_started"
  | "question_changed"
  | "answer_submitted"
  | "scores_updated"
  | "game_finished"
  | "heartbeat"
  | "error";

interface SSEEvent {
  type: SSEEventType;
  payload: unknown;
}

interface UseRoomEventsOptions {
  code: string | null;
  playerId: string | null;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
}

interface UseRoomEventsReturn {
  isConnected: boolean;
  error: string | null;
  reconnect: () => void;
}

export function useRoomEvents({
  code,
  playerId,
  autoReconnect = true,
  maxReconnectAttempts = 10,
}: UseRoomEventsOptions): UseRoomEventsReturn {
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const [error, setError] = useState<string | null>(null);

  // Get actions from game store
  const {
    setRoom,
    addPlayer,
    removePlayer,
    updateGameState,
    submitAnswer,
    updateScores,
    setConnectionState,
  } = useGameStore();

  // Calculate exponential backoff delay
  const getReconnectDelay = useCallback(() => {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 30s
    const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
    return delay;
  }, []);

  // Handle SSE events
  const handleSSEEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.type) {
        case "initial_state": {
          const room = event.payload as Room;
          setRoom(room);
          setConnectionState(true, null);
          break;
        }

        case "player_joined": {
          const { player, room } = event.payload as { player: Player; room: Room };
          addPlayer(player);
          setRoom(room);
          break;
        }

        case "game_started": {
          const { room } = event.payload as { room: Room };
          setRoom(room);
          break;
        }

        case "question_changed": {
          const { questionIndex, room } = event.payload as {
            questionIndex: number;
            room: Room;
          };
          updateGameState({
            currentQuestionIndex: questionIndex,
            currentQuestion: room.questions[questionIndex] || null,
            answers: [], // Clear answers for new question
          });
          break;
        }

        case "answer_submitted": {
          const payload = event.payload as {
            playerId: string;
            questionIndex: number;
            selectedOption: number;
            isCorrect: boolean;
            points: number;
            room: Room;
          };

          const answer: Answer = {
            playerId: payload.playerId,
            questionId: payload.room.questions[payload.questionIndex]?.id || "",
            selectedOption: payload.selectedOption,
            timeToAnswer: 0, // This would need to be tracked separately
            isCorrect: payload.isCorrect,
            points: payload.points,
          };

          submitAnswer(answer);
          updateScores(payload.room.scores);
          setRoom(payload.room);
          break;
        }

        case "scores_updated": {
          const { scores, room } = event.payload as {
            scores: { [playerId: string]: number };
            room: Room;
          };
          updateScores(scores);
          setRoom(room);
          break;
        }

        case "game_finished": {
          const { room } = event.payload as { room: Room };
          setRoom(room);
          break;
        }

        case "heartbeat":
          // Heartbeat received, connection is alive
          setConnectionState(true, null);
          break;

        case "error": {
          const errorPayload = event.payload as { message: string };
          setError(errorPayload.message);
          setConnectionState(false, errorPayload.message);
          break;
        }

        default:
          console.warn("Unknown SSE event type:", event.type);
      }
    },
    [setRoom, addPlayer, updateGameState, submitAnswer, updateScores, setConnectionState]
  );

  // Connect to SSE
  const connect = useCallback(() => {
    if (!code) {
      setError("Room code is required");
      return;
    }

    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    // Clear any pending reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    try {
      // Create new EventSource connection
      const eventSource = new EventSource(`/api/rooms/${code}/events`);
      eventSourceRef.current = eventSource;

      // Handle connection open
      eventSource.onopen = () => {
        console.log("SSE connection opened");
        setError(null);
        setConnectionState(true, null);
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection
      };

      // Handle messages
      eventSource.onmessage = (event) => {
        try {
          const data: SSEEvent = JSON.parse(event.data);
          handleSSEEvent(data);
        } catch (err) {
          console.error("Failed to parse SSE message:", err);
        }
      };

      // Handle errors
      eventSource.onerror = (err) => {
        console.error("SSE connection error:", err);
        setConnectionState(false, "Connection lost");

        // Close the connection
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt reconnection if enabled
        if (autoReconnect && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = getReconnectDelay();
          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          setError("Max reconnection attempts reached. Please refresh the page.");
          setConnectionState(false, "Max reconnection attempts reached");
        }
      };
    } catch (err) {
      console.error("Failed to create EventSource:", err);
      setError("Failed to connect to room");
      setConnectionState(false, "Failed to connect");
    }
  }, [code, autoReconnect, maxReconnectAttempts, getReconnectDelay, handleSSEEvent, setConnectionState]);

  // Manual reconnect function
  const reconnect = useCallback(() => {
    reconnectAttemptsRef.current = 0;
    setError(null);
    connect();
  }, [connect]);

  // Connect when code changes
  useEffect(() => {
    if (code) {
      connect();
    }

    // Cleanup on unmount or code change
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [code, connect]);

  // Get connection state from store
  const isConnected = useGameStore((state) => state.isConnected);

  return {
    isConnected,
    error,
    reconnect,
  };
}

// Helper to close all SSE connections (useful for cleanup)
export function closeRoomEvents(): void {
  // This is handled by the cleanup function in useEffect
  // but can be called manually if needed
}
