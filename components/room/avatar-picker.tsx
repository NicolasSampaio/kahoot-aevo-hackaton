"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const AVATARS = [
  "🦊",
  "🐼",
  "🦁",
  "🐨",
  "🐸",
  "🦄",
  "🐙",
  "🦋",
];

interface AvatarPickerProps {
  selectedAvatar: string;
  onSelect: (avatar: string) => void;
}

export function AvatarPicker({ selectedAvatar, onSelect }: AvatarPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Choose Your Avatar</label>
      <div className="grid grid-cols-4 gap-3">
        {AVATARS.map((avatar, index) => (
          <motion.button
            key={avatar}
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(avatar)}
            className={cn(
              "relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all border-2",
              selectedAvatar === avatar
                ? "border-indigo-500 bg-indigo-50 shadow-lg"
                : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
            )}
          >
            {avatar}
            {selectedAvatar === avatar && (
              <motion.div
                layoutId="avatar-selected"
                className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}