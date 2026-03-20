import { useState, useCallback, useRef, useEffect } from "react";

interface UseTimerReturn {
  timeLeft: number;
  isRunning: boolean;
  startTimer: (duration?: number) => void;
  pauseTimer: () => void;
  resetTimer: (duration?: number) => void;
}

export function useTimer(defaultDuration: number = 20): UseTimerReturn {
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration: number = defaultDuration) => {
      clearTimer();
      setTimeLeft(duration);
      setIsRunning(true);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [clearTimer, defaultDuration]
  );

  const pauseTimer = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const resetTimer = useCallback(
    (duration: number = defaultDuration) => {
      clearTimer();
      setTimeLeft(duration);
      setIsRunning(false);
    },
    [clearTimer, defaultDuration]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  return {
    timeLeft,
    isRunning,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
