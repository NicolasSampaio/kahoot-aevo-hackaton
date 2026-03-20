import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function calculatePoints(timeLeft: number, timeLimit: number): number {
  return Math.round(1000 * (timeLeft / timeLimit));
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function getTimeBonus(timeLeft: number, timeLimit: number): number {
  const percentage = timeLeft / timeLimit;
  if (percentage > 0.8) return 500;
  if (percentage > 0.5) return 300;
  if (percentage > 0.2) return 100;
  return 0;
}
