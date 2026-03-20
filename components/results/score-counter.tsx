import { useState, useEffect } from 'react';
import { useSpring } from 'framer-motion';

interface ScoreCounterProps {
  count: number;
}

export default function ScoreCounter({ count }: ScoreCounterProps) {
  const [displayCount, setDisplayCount] = useState(0);
  const [, set] = useSpring({ 
    to: 0, 
    from: 0, 
    onChange: (value) => {
      setDisplayCount(Math.round(value));
    }
  });

  // Update the spring target when the count prop changes
  useEffect(() => {
    set({ to: count });
  }, [count]);

  return (
    <div className="text-3xl font-bold text-indigo-600">
      {displayCount}
    </div>
  );
}