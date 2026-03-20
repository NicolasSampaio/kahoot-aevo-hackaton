import { motion } from 'framer-motion';

interface FullLeaderboardProps {
  players: Array<{
    id: string;
    name: string;
    avatar: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    averageResponseTime: number;
    longestStreak: number;
  }>;
  currentPlayerId: string | null;
}

export default function FullLeaderboard({ players, currentPlayerId }: FullLeaderboardProps) {
  if (players.length === 0) return null;

  // Find max score for proportional bar widths
  const maxScore = Math.max(...players.map(p => p.score));

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Leaderboard</h2>
      <div className="space-y-4">
        {players.map((player, index) => {
          const isCurrentPlayer = player.id === currentPlayerId;
          const scorePercentage = (player.score / maxScore) * 100 || 0;
          
          return (
            <motion.div
              key={player.id}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                opacity: 1, 
                x: 0,
                transition: { 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20
                } 
              }}
              className={`flex items-center px-4 py-3 rounded-lg shadow-sm ${isCurrentPlayer ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'bg-white border'} `}
            >
              {/* Rank */}
              <div className="w-12 flex-shrink-0 text-center font-bold text-gray-600">
                {index + 1}
              </div>
              
              {/* Avatar */}
              <div className="w-10 h-10 flex-shrink-0">
                <img 
                  src={player.avatar} 
                  alt={player.name} 
                  className="w-full h-full rounded-full object-cover border-2 border-white"
                />
              </div>
              
              {/* Name */}
              <div className="flex-1 min-w-0 ml-4">
                <p className="font-medium truncate">{player.name}</p>
                <p className="text-sm text-gray-500">{player.correctAnswers}/${player.totalQuestions} correct</p>
              </div>
              
              {/* Score Bar */}
              <div className="w-32 flex-shrink-0">
                <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full transition-all duration-750"
                    style={{ width: `${scorePercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Score */}
              <div className="w-16 flex-shrink-0 text-end font-bold text-gray-800 ml-4">
                {player.score}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}