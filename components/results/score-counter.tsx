import { useEffect } from 'react';
import { useSpring, useTransform, MotionValue, useMotionValue, motion } from 'framer-motion';

interface ScoreCounterProps {
  count: number;
}

export default function ScoreCounter({ count }: ScoreCounterProps) {
  const motionCount = useMotionValue(0);
  const springCount = useSpring(motionCount, {
    stiffness: 100,
    damping: 30,
  });
  const rounded = useTransform(springCount, (latest) => Math.round(latest));

  useEffect(() => {
    motionCount.set(count);
  }, [count, motionCount]);

  return (
    <div className="text-3xl font-bold text-indigo-600">
      <motion.span>{rounded}</motion.span>
    </div>
  );
}