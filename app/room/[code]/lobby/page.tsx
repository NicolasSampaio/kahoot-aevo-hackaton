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
    const roomDataStr = sessionStorage.getItem("roomData");
    const isHostStr = sessionStorage.getItem("isHost");

    if (!roomDataStr) {
      router.push("/");
      return;
    }

    const roomData = JSON.parse(roomDataStr);
    setIsHost(isHostStr === "true");
    setPlayers(roomData.players || []);
    setRoomName(roomData.roomName || "");

    const interval = setInterval(() => {
      const updatedRoomData = sessionStorage.getItem("roomData");
      if (updatedRoomData) {
        const parsed = JSON.parse(updatedRoomData);
        setPlayers(parsed.players || []);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [router]);

  const handleStartGame = () => {
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
    <main className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
          <Button variant="ghost" className="text-white/80 hover:bg-white/20">
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
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {roomName || "Quiz Room"}
          </h1>
          <p className="text-white/60">Waiting for players to join...</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-semibold text-gray-800">
                Room Code
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <RoomCodeDisplay code={roomCode} />
              <p className="text-xs text-gray-500 text-center mt-4">
                Share this code with players
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-semibold text-gray-800">
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
                  <p className="text-gray-400 text-sm">
                    Waiting for more players...
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          {isHost ? (
            <motion.div className="text-center">
              <Button
                size="lg"
                onClick={handleStartGame}
                disabled={players.length < 2 || isStarting}
                className="px-12 py-6 text-xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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
                <p className="text-white/60 text-sm mt-3">
                  At least 2 players required to start
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-3 h-3 bg-yellow-400 rounded-full"
                />
                <span className="text-white font-medium">
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