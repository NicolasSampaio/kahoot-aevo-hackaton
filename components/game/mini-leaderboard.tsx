import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface MiniLeaderboardProps {
  players: any[]; // Player[] type
  onNextQuestion: () => void;
  isHost: boolean;
}

export default function MiniLeaderboard({ 
  players, 
  onNextQuestion, 
  isHost 
}: MiniLeaderboardProps) {
  // Sort players by score descending and take top 5
  const topPlayers = [...players]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  // For demo purposes, we'll simulate position changes
  // In a real app, we'd compare with previous leaderboard state
  useEffect(() => {
    // Animation would be handled by motion components
  }, [topPlayers.length]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="w-full max-w-4xl"
    >
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 text-white">
          Leaderboard
        </h2>
        
        <div className="space-y-4">
          {topPlayers.map((player, index) => {
            // For demo, we'll randomly assign position changes
            // In reality, we'd compare with previous rankings
            const positionChange = Math.random() > 0.7 ? 
              (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3) : 
              0;
            
            return (
              <motion.div
                key={player.id}
                initial={{ x: positionChange > 0 ? -20 : positionChange < 0 ? 20 : 0, opacity: 0 }}
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
                
                {/* Position change indicator */}
                {positionChange !== 0 && (
                  <div className="w-8 flex-shrink-0 text-center">
                    {positionChange > 0 ? (
                      <span className="text-green-400">↑{positionChange}</span>
                    ) : (
                      <span className="text-red-400">↓{Math.abs(positionChange)}</span>
                    )}
                  </div>
                )}
                
                {/* Player info */}
                <div className="flex-1 flex items-center space-x-4">
                  {/* Avatar placeholder */}
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{player.name}</h3>
                    <p className="text-sm text-gray-400">Score: {player.score}</p>
                  </div>
                </div>
                
                {/* Score bar */}
                <div className="w-32 flex-shrink-0">
                  <div className="bg-gray-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-1000 ease-out"
                      style={{ 
                        width: `${Math.min((player.score / Math.max(1, Math.max(...players.map(p => p.score)))) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
          {/* Fill remaining spots with placeholders if less than 5 players */}
          {topPlayers.length < 5 && Array.from({ length: 5 - topPlayers.length }).map((_, i) => (
            <motion.div
              key={`placeholder-${i}`}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ 
                type: 'spring', 
                stiffness: 300, 
                damping: 20,
                delay: (topPlayers.length + i) * 0.1
              }}
              className="flex items-center p-4 bg-gray-900/50 rounded-xl"
            >
              <div className="w-12 flex-shrink-0 text-center font-bold text-white">
                {topPlayers.length + i + 1}
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
      
      {/* Auto-advance notice or button */}
      {isHost ? (
        <motion.button
          onClick={onNextQuestion}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
          className="w-full mt-6 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-transform duration-200"
          whileTap={{ scale: 0.95 }}
        >
          Next Question
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.5 }}
          className="w-full mt-6 text-center text-lg text-gray-400"
        >
          Next question in 3 seconds...
        </motion.div>
      )}
    </motion.div>
  );
}