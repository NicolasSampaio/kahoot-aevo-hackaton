"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Trophy, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ResultsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6"
      >
        <Link href="/">
          <Button variant="ghost" className="text-white hover:bg-white/20">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-8xl mb-4"
        >
          🏆
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Game Over!
        </h1>
        <p className="text-xl text-white/80">
          Great game! Check out the final standings
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" />
              Final Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { rank: 1, name: "You", score: 12500, trophy: "🥇" },
              { rank: 2, name: "Alice", score: 10200, trophy: "🥈" },
              { rank: 3, name: "Bob", score: 8900, trophy: "🥉" },
              { rank: 4, name: "Charlie", score: 7500, trophy: "" },
            ].map((player, index) => (
              <motion.div
                key={player.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  player.rank === 1 ? "bg-yellow-100" : "bg-gray-50"
                }`}
              >
                <span className="text-2xl">{player.trophy || `#${player.rank}`}</span>
                <span className="font-bold">{player.name}</span>
                <span className="ml-auto font-bold text-indigo-600">
                  {player.score.toLocaleString()} pts
                </span>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex gap-4 mt-8"
      >
        <Link href="/">
          <Button className="bg-white text-indigo-600 hover:bg-gray-100">
            <Home className="w-5 h-5 mr-2" />
            Home
          </Button>
        </Link>
        <Link href="/play">
          <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300">
            <RotateCcw className="w-5 h-5 mr-2" />
            Play Again
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}
