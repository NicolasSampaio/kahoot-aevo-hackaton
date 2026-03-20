"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  size?: "small" | "medium" | "large";
}

export function Timer({ timeLeft, totalTime, size = "medium" }: TimerProps) {
  const percentage = (timeLeft / totalTime) * 100;
  const isCritical = timeLeft <= 5;

  const sizeClasses = {
    small: "w-16 h-16 text-lg",
    medium: "w-24 h-24 text-3xl",
    large: "w-32 h-32 text-5xl",
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn("relative", sizeClasses[size])}>
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-gray-200"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          className={cn(
            isCritical ? "text-red-500" : "text-indigo-600"
          )}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset,
          }}
          animate={{
            strokeDashoffset,
          }}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.span
          animate={isCritical ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: isCritical ? Infinity : 0 }}
          className={cn(
            "font-bold",
            isCritical && "text-red-500"
          )}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  );
}
