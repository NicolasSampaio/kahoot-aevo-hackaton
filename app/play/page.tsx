"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Users, Clock, Zap, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { generateRoomCode, cn } from "@/lib/utils";
import { useGameState, useTimer } from "@/hooks";
import type { Room, Player, Question, GameState } from "@/types/game";

function PlayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roomCode = searchParams.get("room");
  const playerName = searchParams.get("name");

  const [playerNameInput, setPlayerNameInput] = useState(playerName || "");
  const [joinedRoomCode, setJoinedRoomCode] = useState(roomCode || "");
  const [isJoining, setIsJoining] = useState(!!roomCode);
  const [copied, setCopied] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);

  const { timeLeft, startTimer, resetTimer } = useTimer(20);
  const { gameState, setGameState, currentQuestion, score, addScore } = useGameState();

  useEffect(() => {
    if (roomCode && playerName) {
      startGame();
    }
  }, []);

  const startGame = () => {
    setIsJoining(true);
    setGameState("waiting");
    setTimeout(() => {
      setGameState("countdown");
      let count = 3;
      const countdown = setInterval(() => {
        count--;
        if (count === 0) {
          clearInterval(countdown);
          setGameState("question");
          startTimer();
        }
      }, 1000);
    }, 1000);
  };

  const handleJoinRoom = async () => {
    if (!playerNameInput.trim() || !joinedRoomCode.trim()) return;
    
    try {
      const response = await fetch("/api/rooms/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: joinedRoomCode.toUpperCase(),
          playerName: playerNameInput.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to join room");
        return;
      }

      // Store room data locally
      sessionStorage.setItem("roomData", JSON.stringify(data.room));
      sessionStorage.setItem("playerId", data.player.id);
      sessionStorage.setItem("isHost", "false");

      router.push(`/room/${joinedRoomCode.toUpperCase()}/lobby`);
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleAnswer = (optionIndex: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const isCorrect = optionIndex === currentQuestion?.correctOptionIndex;
    if (isCorrect) {
      const points = Math.round(1000 * (timeLeft / 20));
      addScore(points);
    }

    setTimeout(() => {
      setGameState("answer-reveal");
      setTimeout(() => {
        setGameState("leaderboard");
        setTimeout(() => {
          setGameState("question");
          setSelectedOption(null);
          setHasAnswered(false);
          resetTimer();
          startTimer();
        }, 3000);
      }, 2000);
    }, 1000);
  };

  if (!isJoining) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute top-6 left-6"
        >
          <Link href="/">
            <Button variant="ghost" className="text-card-foreground hover:bg-card/20">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="bg-card backdrop-blur-sm shadow-2xl">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Join Game
              </CardTitle>
              <p className="text-muted-foreground mt-2">Enter your name and room code</p>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Your Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name..."
                  value={playerNameInput}
                  onChange={(e) => setPlayerNameInput(e.target.value)}
                  className="text-lg py-6"
                  maxLength={20}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Room Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code..."
                  value={joinedRoomCode}
                  onChange={(e) => setJoinedRoomCode(e.target.value.toUpperCase())}
                  className="text-lg py-6 text-center font-mono tracking-widest"
                  maxLength={6}
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleJoinRoom}
                disabled={!playerNameInput.trim() || !joinedRoomCode.trim()}
                className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                Join Room
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {gameState === "waiting" && (
          <motion.div
            key="waiting"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center"
          >
      <Card className="bg-card backdrop-blur-sm shadow-2xl p-8">
      <CardTitle className="text-2xl font-bold mb-4">Waiting for Players</CardTitle>
      <div className="flex items-center justify-center gap-2 mb-6">
      <span className="text-6xl font-mono font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {roomCode}
                </span>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-6 h-6 text-green-500" />
                  ) : (
                    <Copy className="w-6 h-6 text-gray-500" />
                  )}
                </button>
              </div>
      <p className="text-muted-foreground">Share this code with your friends</p>
      <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-5 h-5" />
                </motion.div>
                <span>Waiting for players to join...</span>
              </div>
            </Card>
          </motion.div>
        )}

        {gameState === "countdown" && (
          <motion.div
            key="countdown"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            className="text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-[200px] font-bold text-foreground drop-shadow-lg"
            >
              3
            </motion.div>
          </motion.div>
        )}

        {gameState === "question" && currentQuestion && (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
      <div className="bg-secondary/20 backdrop-blur-sm rounded-xl px-4 py-2 text-card-foreground font-bold">
      <Zap className="w-5 h-5 inline mr-2 text-primary-foreground" />
                  Score: {score}
                </div>
              </div>
              <div
                className={cn(
                  "bg-white/20 backdrop-blur-sm rounded-xl px-6 py-2 text-white font-bold text-2xl",
                  timeLeft <= 5 && "timer-critical"
                )}
              >
                {timeLeft}s
              </div>
            </div>

            <Card className="bg-card shadow-2xl mb-6">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-center mb-8">
                  {currentQuestion.text}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswer(index)}
                      disabled={hasAnswered}
                      className={cn(
                        "answer-card p-6 rounded-xl font-bold text-lg text-left transition-all",
                        selectedOption === index
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      )}
                    >
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-secondary/20 rounded-lg mr-3 text-card-foreground">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {gameState === "answer-reveal" && (
          <motion.div
            key="answer-reveal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={cn(
                "text-8xl font-bold mb-8",
                selectedOption === currentQuestion?.correctOptionIndex
                  ? "text-green-500"
                  : "text-red-500"
              )}
            >
              {selectedOption === currentQuestion?.correctOptionIndex ? "✓" : "✗"}
            </motion.div>
            <p className="text-2xl text-card-foreground font-bold">
              {selectedOption === currentQuestion?.correctOptionIndex
                ? "Correct! +Points"
                : "Wrong!"}
            </p>
          </motion.div>
        )}

        {gameState === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <Card className="bg-card shadow-2xl">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Leaderboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[1, 2, 3].map((rank, index) => (
                    <motion.div
                      key={rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "leaderboard-row flex items-center gap-4 p-4 rounded-xl",
                        index === 0 && "bg-yellow-100",
                        index === 1 && "bg-gray-100",
                        index === 2 && "bg-orange-100"
                      )}
                    >
                      <span className="text-2xl font-bold w-8">
                        {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                      </span>
                      <span className="font-bold">{playerName}</span>
                      <span className="ml-auto font-bold text-primary">{score} pts</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-border border-t-transparent rounded-full"
        />
      </main>
    }>
      <PlayContent />
    </Suspense>
  );
}
