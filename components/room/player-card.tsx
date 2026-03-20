"use client";

import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlayerCardProps {
  name: string;
  avatar: string;
  isHost?: boolean;
  index?: number;
}

export function PlayerCard({ name, avatar, isHost = false, index = 0 }: PlayerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-md",
        "border-2 border-transparent hover:border-indigo-200 transition-all"
      )}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-2xl">
          {avatar}
        </div>
        {isHost && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
            <Crown className="w-3 h-3 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">{name}</p>
        {isHost && (
          <p className="text-xs text-yellow-600 font-medium">Host</p>
        )}
      </div>
    </motion.div>
  );
}