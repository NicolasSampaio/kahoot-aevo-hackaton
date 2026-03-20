import { useState, useCallback, useEffect } from "react";
import type { Room, Player } from "@/types/game";
import { v4 as uuidv4 } from "uuid";

interface UseRoomReturn {
  room: Room | null;
  localPlayer: Player | null;
  isHost: boolean;
  createRoom: (hostName: string, maxPlayers: number) => void;
  joinRoom: (roomCode: string, playerName: string) => boolean;
  addPlayer: (name: string) => Player;
  removePlayer: (playerId: string) => void;
  updatePlayerScore: (playerId: string, points: number) => void;
}

export function useRoom(): UseRoomReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null);
  const [isHost, setIsHost] = useState(false);

  const createRoom = useCallback(
    (hostName: string, maxPlayers: number) => {
      const hostId = uuidv4();
      const player: Player = {
        id: hostId,
        name: hostName,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostName}`,
        score: 0,
        answers: [],
      };

const newRoom: Room = {
      id: uuidv4(),
      code: generateRoomCode(),
      hostId,
      players: [player],
      questions: [],
      status: "waiting",
      maxPlayers,
      currentQuestionIndex: 0,
      answers: {},
      scores: { [hostId]: 0 },
    };

      setRoom(newRoom);
      setLocalPlayer(player);
      setIsHost(true);
    },
    []
  );

  const joinRoom = useCallback(
    (roomCode: string, playerName: string): boolean => {
      return true;
    },
    []
  );

  const addPlayer = useCallback((name: string): Player => {
    const newPlayer: Player = {
      id: uuidv4(),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      score: 0,
      answers: [],
    };

    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: [...prev.players, newPlayer],
      };
    });

    return newPlayer;
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.filter((p) => p.id !== playerId),
      };
    });
  }, []);

  const updatePlayerScore = useCallback((playerId: string, points: number) => {
    setRoom((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        players: prev.players.map((p) =>
          p.id === playerId ? { ...p, score: p.score + points } : p
        ),
      };
    });
  }, []);

  return {
    room,
    localPlayer,
    isHost,
    createRoom,
    joinRoom,
    addPlayer,
    removePlayer,
    updatePlayerScore,
  };
}

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
