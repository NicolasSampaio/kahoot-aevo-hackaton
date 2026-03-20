"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Users, Zap, Trophy } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <motion.h1
          className="text-6xl md:text-8xl font-extrabold text-white drop-shadow-lg mb-4"
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Kahoot <span className="text-yellow-300">Aevo</span>
        </motion.h1>
        <p className="text-xl md:text-2xl text-white/90 max-w-md mx-auto">
          Challenge your friends in real-time quiz battles!
        </p>
      </motion.div>

      <motion.div
        className="flex flex-col md:flex-row gap-6 mb-12"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Link
          href="/create-room"
          className="group relative px-8 py-4 bg-yellow-400 hover:bg-yellow-300 rounded-2xl font-bold text-xl text-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Play className="w-6 h-6" />
          Create Room
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/20"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>

        <Link
          href="/play"
          className="group relative px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-2xl font-bold text-xl text-white border-2 border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3"
        >
          <Users className="w-6 h-6" />
          Join Room
          <motion.div
            className="absolute inset-0 rounded-2xl bg-white/10"
            initial={{ opacity: 0, scale: 0 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </Link>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <FeatureCard
          icon={<Zap className="w-8 h-8" />}
          title="Lightning Fast"
          description="Real-time gameplay with instant feedback"
        />
        <FeatureCard
          icon={<Users className="w-8 h-8" />}
          title="Multiplayer"
          description="Challenge up to 10 players simultaneously"
        />
        <FeatureCard
          icon={<Trophy className="w-8 h-8" />}
          title="Compete"
          description="Climb the leaderboard and earn rewards"
        />
      </motion.div>

      <motion.footer
        className="mt-16 text-white/60 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Built with passion for learning
      </motion.footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20"
      whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4 text-white">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white/80 text-sm">{description}</p>
    </motion.div>
  );
}
