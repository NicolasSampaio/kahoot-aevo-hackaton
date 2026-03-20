import { motion } from 'framer-motion';

interface PodiumProps {
  players: Array<{
    id: string;
    name: string;
    avatar: string;
    score: number;
  }>;
}

export default function Podium({ players }: PodiumProps) {
  // Define medal positions: 3rd (left), 2nd (right), 1st (center)
  const podiumPositions = [
    { index: 2, x: -80, y: 0, delay: 0 },   // 3rd place - left
    { index: 1, x: 80, y: 0, delay: 100 },  // 2nd place - right  
    { index: 0, x: 0, y: -40, delay: 200 }  // 1st place - center, tallest
  ];

  return (
    <div className="flex items-end justify-center space-x-8 pb-12">
      {podiumPositions.map(({ index, x, y, delay }) => {
        const player = players[index];
        if (!player) return null;

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, y: 50 }}
            animate({{ 
              opacity: 1, 
              y: y, 
              x: x,
              transition: { 
                delay: delay / 1000,
                type: 'spring',
                stiffness: 300,
                damping: 20
              } 
            })}
            className="relative flex items-end space-x-2"
          >
            {/* Avatar */}
            <div className="relative">
              <img 
                src={player.avatar} 
                alt={player.name} 
                className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
              />
              {/* Medal overlay */}
              <div className="absolute -top-2 -left-2 w-8 h-8">
                {index === 0 && '🥇'} {/* Gold */}
                {index === 1 && '🥈'} {/* Silver */}
                {index === 2 && '🥉'} {/* Bronze */}
              </div>
            </div>
            
            {/* Player Info */}
            <div className="text-center space-y-1">
              <p className="font-semibold">{player.name}</p>
              <p className="text-2xl font-bold text-indigo-600">{player.score}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}