import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface FinalResultsProps {
  players: any[]; // Player[] type
  onReset: () => void;
}

export default function FinalResults({ 
  players, 
  onReset 
}: FinalResultsProps) {
  // Sort players by score descending
  const sortedPlayers = [...players]
    .sort((a, b) => b.score - a.score);

  useEffect(() => {
    // Animation would be handled by motion components
  }, [sortedPlayers.length]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.2 }}
        className="text-4xl font-bold text-center mb-6"
      >
        Game Over!
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
          <h2 className="text-2xl font-bold text-center mb-6 text-white">
            Final Leaderboard
          </h2>
          
          <div className="space-y-4">
            {sortedPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  delay: index * 0.1
                }}
                className="flex items-center p-4 bg-gray-900/50 rounded-xl"
              >
                {/* Position */}
                <div className="w-12 flex-shrink-0 text-center font-bold text-white">
                  {index + 1}
                </div>
                
                {/* Player info */}
                <div className="flex-1 flex items-center space-x-4">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-gray-600 rounded-flex items-center justify-center text-white">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{player.name}</h3>
                    <p className="text-sm text-gray-400">Final Score: {player.score}</p>
                  </div>
                </div>
                
                {/* Score bar */}
                <div className="w-32 flex-shrink-0">
                  <div className="bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-${index === 0 ? 'yellow-400' : index === 1 ? 'gray-400' : index === 2 ? 'brown-400' : 'blue-500'} transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min((player.score / Math.max(1, Math.max(...sortedPlayers.map(p => p.score)))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Fill remaining spots with placeholders if less than 5 players */}
            {sortedPlayers.length < 5 && Array.from({ length: 5 - sortedPlayers.length }).map((_, i) => (
              <motion.div
                key={`final-placeholder-${i}`}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 20,
                  delay: (sortedPlayers.length + i) * 0.1
                }}
                className="flex items-center p-4 bg-gray-900/50 rounded-xl"
              >
                <div className="w-12 flex-shrink-0 text-center font-bold text-white">
                  {sortedPlayers.length + i + 1}
                </div>
                <div className="w-8 flex-shrink-0"></div>
                <div className="flex-1 flex items-center space-x-4 text-gray-500">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                    -
                  </div>
                  <div>
                    <h3 className="font-medium">-</h3>
                    <p className="text-sm">-</p>
                  </div>
                </div>
                <div className="w-32 flex-shrink-0">
                  <div className="bg-gray-800 h-2.5 rounded-full"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={onReset}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
        className="w-full max-w-2xl mt-8 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-transform duration-200"
        whileTap={{ scale: 0.95 }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
}