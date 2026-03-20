import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export default function CountdownScreen() {
  const { setGameState } = useGameEngine();
  const { prepareCountdownSound } = useSoundEffects();

  useEffect(() => {
    // Prepare sound effect (hook only, no actual implementation)
    prepareCountdownSound();
    
    // Auto-advance to question after countdown
    const timer = setTimeout(() => {
      setGameState('question');
    }, 3000); // 3 seconds for 3-2-1 countdown
    
    return () => clearTimeout(timer);
  }, [setGameState, prepareCountdownSound]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring', 
          stiffness: 300, 
          damping: 20 
        }}
        className="text-9xl font-bold"
      >
        3
      </motion.div>
      
      {/* In a real implementation, we'd animate 3-2-1 with proper timing */}
      {/* For simplicity, we're showing just 3 here */}
      
      <div className="mt-8 text-lg opacity-80">
        Get ready...
      </div>
    </div>
  );
}