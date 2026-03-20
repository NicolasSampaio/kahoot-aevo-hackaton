"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { ArrowLeft, Users, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionList, type QuestionFormData } from "@/components/room/question-form";
import { generateRoomCode } from "@/lib/utils";

const INITIAL_QUESTIONS: QuestionFormData[] = [
  {
    id: "q-1",
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    timeLimit: 20,
  },
  {
    id: "q-2",
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    timeLimit: 20,
  },
  {
    id: "q-3",
    text: "",
    options: ["", "", "", ""],
    correctOptionIndex: 0,
    timeLimit: 20,
  },
];

export default function CreateRoom() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(10);
  const [questions, setQuestions] = useState<QuestionFormData[]>(INITIAL_QUESTIONS);
  const [isCreating, setIsCreating] = useState(false);

  const isValid = () => {
    if (!roomName.trim()) return false;
    if (maxPlayers < 2 || maxPlayers > 50) return false;
    return questions.every(
      (q) =>
        q.text.trim() &&
        q.options.every((opt) => opt.trim()) &&
        q.options[q.correctOptionIndex]
    );
  };

  const handleCreateRoom = async () => {
    if (!isValid()) return;

    setIsCreating(true);

    try {
      const response = await fetch("/api/rooms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          playerName: "Host",
          maxPlayers,
          questions: questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options,
            correctOptionIndex: q.correctOptionIndex,
            timeLimit: q.timeLimit,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Failed to create room");
        setIsCreating(false);
        return;
      }

      const { code, room, player } = data;

      // Store room data locally
      sessionStorage.setItem("roomData", JSON.stringify(room));
      sessionStorage.setItem("playerId", player.id);
      sessionStorage.setItem("isHost", "true");

      router.push(`/room/${code}/lobby`);
    } catch (err) {
      alert("Network error. Please try again.");
      setIsCreating(false);
    }
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
            Back
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto pt-12"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Create Room
          </h1>
          <p className="text-muted-foreground">Set up your quiz and invite players</p>
        </div>

        <Card className="bg-card backdrop-blur-sm shadow-2xl">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">
                  Room Name
                </label>
                <Input
                  placeholder="My Awesome Quiz"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  className="text-lg py-6"
                  maxLength={50}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Max Players: {maxPlayers}
                </label>
                <input
                  type="range"
                  min={2}
                  max={50}
                  value={maxPlayers}
                  onChange={(e) => setMaxPlayers(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary-foreground"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>2</span>
                  <span>50</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-card-foreground">Questions</h2>
      <span className="text-sm text-muted-foreground">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <QuestionList questions={questions} onChange={setQuestions} />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateRoom}
              disabled={!isValid() || isCreating}
              className="w-full py-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isCreating ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="inline-block w-5 h-5 border-2 border-border border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Create Room
                </>
              )}
            </motion.button>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}