"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnswerCardProps {
  option: string;
  index: number;
  isSelected: boolean;
  isCorrect: boolean | null;
  isRevealed: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function AnswerCard({
  option,
  index,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled,
}: AnswerCardProps) {
  const letters = ["A", "B", "C", "D"];

  const getBackgroundClass = () => {
    if (isRevealed) {
      if (isCorrect) return "bg-green-500 text-white";
      if (isSelected && !isCorrect) return "bg-red-500 text-white";
    }
    if (isSelected) return "bg-indigo-600 text-white";
    return "bg-gray-100 hover:bg-gray-200";
  };

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "answer-card p-6 rounded-xl font-bold text-lg text-left transition-all flex items-center",
        getBackgroundClass(),
        disabled && "cursor-not-allowed"
      )}
    >
      <span className="inline-flex items-center justify-center w-10 h-10 bg-white/20 rounded-lg mr-4 text-lg">
        {letters[index]}
      </span>
      {option}
    </motion.button>
  );
}
