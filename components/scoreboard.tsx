"use client";

import { motion } from "framer-motion";
import type { Player } from "@/types/game";
import { cn } from "@/lib/utils";

interface ScoreboardProps {
  players: Player[];
  currentPlayerId?: string;
}

export function Scoreboard({ players, currentPlayerId }: ScoreboardProps) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const getRankEmoji = (index: number) => {
    switch (index) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `#${index + 1}`;
    }
  };

  const getRowClass = (index: number, playerId: string) => {
    if (playerId === currentPlayerId) {
      return "bg-indigo-100 border-2 border-indigo-500";
    }
    switch (index) {
      case 0:
        return "bg-yellow-100";
      case 1:
        return "bg-gray-100";
      case 2:
        return "bg-orange-100";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-3">
      {sortedPlayers.map((player, index) => (
        <motion.div
          key={player.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "leaderboard-row flex items-center gap-4 p-4 rounded-xl transition-all",
            getRowClass(index, player.id)
          )}
        >
          <span className="text-2xl font-bold w-12 text-center">
            {getRankEmoji(index)}
          </span>
          <img
            src={player.avatar}
            alt={player.name}
            className="w-10 h-10 rounded-full bg-gray-200"
          />
          <span className="font-bold flex-1">{player.name}</span>
          <span className="font-bold text-indigo-600 text-lg">
            {player.score.toLocaleString()} pts
          </span>
        </motion.div>
      ))}
    </div>
  );
}
