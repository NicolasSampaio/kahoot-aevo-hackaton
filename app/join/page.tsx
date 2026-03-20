"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvatarPicker } from "@/components/room/avatar-picker";

export default function JoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("🦊");
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState("");

  const isValid = () => {
    return (
      roomCode.trim().length === 6 &&
      playerName.trim().length > 0 &&
      playerName.trim().length <= 20
    );
  };

  const handleJoin = () => {
    if (!isValid()) return;

    setIsJoining(true);
    setError("");

    const storedRoomData = sessionStorage.getItem("roomData");
    
    if (!storedRoomData) {
      setError("Room not found. Please check the code and try again.");
      setIsJoining(false);
      return;
    }

    const roomData = JSON.parse(storedRoomData);

    if (roomData.roomCode.toUpperCase() !== roomCode.toUpperCase()) {
      setError("Room not found. Please check the code and try again.");
      setIsJoining(false);
      return;
    }

    if (roomData.players.length >= roomData.maxPlayers) {
      setError("Room is full. Please try again later.");
      setIsJoining(false);
      return;
    }

    const playerId = uuidv4();
    const newPlayer = {
      id: playerId,
      name: playerName.trim(),
      avatar: selectedAvatar,
      score: 0,
      isHost: false,
    };

    roomData.players.push(newPlayer);
    sessionStorage.setItem("roomData", JSON.stringify(roomData));
    sessionStorage.setItem("playerId", playerId);
    sessionStorage.setItem("isHost", "false");

    router.push(`/room/${roomCode.toUpperCase()}/lobby`);
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    setRoomCode(value.slice(0, 6));
    setError("");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-900 via-purple-900 to-indigo-900 p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
          <Button variant="ghost" className="text-white/80 hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto pt-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Join Room
          </h1>
          <p className="text-white/60">Enter the code to join a quiz</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Room Code
              </label>
              <Input
                placeholder="Enter 6-digit code"
                value={roomCode}
                onChange={handleRoomCodeChange}
                className="text-center text-2xl font-bold tracking-widest py-6"
                maxLength={6}
              />
              <p className="text-xs text-gray-500 text-center">
                Ask the host for the room code
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Your Name
              </label>
              <Input
                placeholder="Enter your name..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="text-lg py-6"
                maxLength={20}
              />
            </div>

            <AvatarPicker
              selectedAvatar={selectedAvatar}
              onSelect={setSelectedAvatar}
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleJoin}
              disabled={!isValid() || isJoining}
              className="w-full py-4 bg-gradient-to-r from-pink-600 to-indigo-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isJoining ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  Join Room
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}