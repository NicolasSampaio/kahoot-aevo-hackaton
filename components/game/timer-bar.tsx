import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimerBarProps {
  timeLeft: number;
  totalTime: number;
  onTimeOut?: () => void;
}

export default function TimerBar({ timeLeft, totalTime, onTimeOut }: TimerBarProps) {
  const progress = timeLeft / totalTime;

  useEffect(() => {
    if (timeLeft <= 0 && onTimeOut) {
      onTimeOut();
    }
  }, [timeLeft, onTimeOut]);

  return (
    <motion.div
      className="w-full h-4 bg-gray-800 rounded-full overflow-hidden"
      initial={{ scaleX: progress }}
      animate={{ scaleX: progress }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
        style={{ transformOrigin: 'left' }}
      ></motion.div>
    </motion.div>
  );
}