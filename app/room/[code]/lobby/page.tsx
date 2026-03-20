"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomCodeDisplay } from "@/components/room/room-code-display";
import { PlayerCard } from "@/components/room/player-card";

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  isHost: boolean;
}

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const roomCode = params.code as string;

  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomName, setRoomName] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  useEffect(() => {
    console.log("[Lobby Debug] Componente renderizando. isHost:", isHost, "players:", players.length);
  });

  useEffect(() => {
    const roomDataStr = sessionStorage.getItem("roomData");
    const playerId = sessionStorage.getItem("playerId");

    console.log("[Lobby Debug] roomDataStr:", roomDataStr);
    console.log("[Lobby Debug] playerId:", playerId);

    if (!roomDataStr || !playerId) {
      console.log("[Lobby Debug] Dados ausentes, redirecionando...");
      router.push("/");
      return;
    }

    const roomData = JSON.parse(roomDataStr);
    console.log("[Lobby Debug] roomData:", roomData);
    console.log("[Lobby Debug] roomData.hostId:", roomData.hostId);
    console.log("[Lobby Debug] Comparando hostId === playerId:", roomData.hostId, "===", playerId, "=", roomData.hostId === playerId);
    
    const hostStatus = roomData.hostId === playerId;
    console.log("[Lobby Debug] setIsHost:", hostStatus);
    
    setIsHost(hostStatus);
    setPlayers(roomData.players || []);
    setRoomName(roomData.roomName || "");

    console.log("[Lobby Debug] Iniciando polling...");
    const interval = setInterval(async () => {
      try {
        console.log("[Lobby Debug] Fazendo fetch para /api/rooms/" + roomCode);
        const response = await fetch(`/api/rooms/${roomCode}`);
        console.log("[Lobby Debug] Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("[Lobby Debug] Room data recebida:", data);
          
          if (data.success && data.room) {
            console.log("[Lobby Debug] Atualizando players:", data.room.players);
            sessionStorage.setItem("roomData", JSON.stringify(data.room));
            setPlayers(data.room.players || []);
          }
        }
      } catch (err) {
        console.error("[Lobby Debug] Failed to fetch room data:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router, roomCode]);

  const handleStartGame = () => {
    console.log("[Lobby Debug] handleStartGame chamado");
    if (players.length < 2) return;

    setIsStarting(true);

    const roomDataStr = sessionStorage.getItem("roomData");
    if (roomDataStr) {
      const roomData = JSON.parse(roomDataStr);
      roomData.status = "question";
      roomData.currentQuestionIndex = 0;
      sessionStorage.setItem("roomData", JSON.stringify(roomData));
    }

    setTimeout(() => {
      router.push(`/play?room=${roomCode}`);
    }, 1000);
  };

  return (
      <main className="min-h-screen bg-gradient-to-br from-card via-secondary to-background p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
          <Button variant="ghost" className="text-muted-foreground hover:bg-card/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Leave
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto pt-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            {roomName || "Quiz Room"}
          </h1>
          <p className="text-muted-foreground">Waiting for players to join...</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="bg-card backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center pb-2">
      <CardTitle className="text-xl font-semibold text-card-foreground">
                Room Code
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <RoomCodeDisplay code={roomCode} />
              <p className="text-xs text-muted-foreground text-center mt-4">
                Share this code with players
              </p>
      </CardContent>
      </Card>

      <Card className="bg-card backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center pb-2">
      <CardTitle className="text-xl font-semibold text-card-foreground">
                Players ({players.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {players.map((player, index) => (
                  <PlayerCard
                    key={player.id}
                    name={player.name}
                    avatar={player.avatar}
                    isHost={player.isHost}
                    index={index}
                  />
                ))}
              </AnimatePresence>
              {players.length < 2 && (
      <div className="text-center py-4">
      <p className="text-muted-foreground text-sm">
                    Waiting for more players...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          {isHost ? (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleStartGame}
                disabled={players.length < 2 || isStarting}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-success to-primary hover:from-success/90 hover:to-primary/90"
              >
                {isStarting ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="w-6 h-6 mr-2" />
                    Start Game
                  </>
                )}
              </Button>
              {players.length < 2 && (
                <p className="text-muted-foreground text-sm mt-3">
                  At least 2 players required to start
                </p>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-secondary/20 rounded-full">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-primary rounded-full"
                />
                <span className="text-foreground font-medium">
                  Waiting for host to start...
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </main>
  );
}