import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnswerCardProps {
  text: string;
  index: number; // 0,1,2,3 to determine color and icon
  isSelected: boolean;
  isLocked: boolean;
  onSelect: () => void;
}

// Define colors and icons for each index
const answerConfig = [
  { color: 'bg-red-500', icon: '▲' }, // triangle
  { color: 'bg-blue-500', icon: '◆' }, // diamond
  { color: 'bg-green-500', icon: '●' }, // circle
  { color: 'bg-yellow-500', icon: '■' }, // square
];

export default function AnswerCard({ 
  text, 
  index, 
  isSelected, 
  isLocked, 
  onSelect 
}: AnswerCardProps) {
  const [scale, setScale] = useState(1);
  const config = answerConfig[index] || answerConfig[0];

  const handleSelect = () => {
    if (!isLocked && !isSelected) {
      onSelect();
      // Animation for selection
      setScale(0.95);
      setTimeout(() => setScale(1), 100);
    }
  };

  // Locked animation (check mark)
  useEffect(() => {
    if (isLocked) {
      // Pulse animation when locked
      setScale(1.05);
      setTimeout(() => setScale(1), 500);
    }
  }, [isLocked]);

  return (
    <motion.div
      onClick={handleSelect}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`relative w-full h-64 rounded-2xl ${config.color} text-white flex flex-col items-center justify-center cursor-pointer pointer-events-${isLocked ? 'none' : 'all'} transform-gpu`}
      style={{ transform: `scale(${scale})` }}
    >
      {/* Shape icon */}
      <motion.div
        className="text-6xl mb-4"
        initial={{ rotate: 0 }}
        animate={{ rotate: isLocked ? 360 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, duration: isLocked ? 0.8 : 0 }}
      >
        {config.icon}
      </motion.div>
      
      {/* Answer text */}
      <motion.div
        className="text-xl font-medium text-center"
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: isLocked ? 0.2 : 0 }}
      >
        {text}
      </motion.div>
      
      {/* Selected state overlay */}
      {isSelected && !isLocked && (
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        />
      )}
      
      {/* Locked state checkmark */}
      {isLocked && (
        <motion.div
          className="absolute left-3 top-3 text-2xl"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
}