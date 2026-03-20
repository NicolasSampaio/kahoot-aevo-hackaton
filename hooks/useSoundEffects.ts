import { useCallback } from "react";

export function useSoundEffects() {
  const prepareCountdownSound = useCallback(() => {
    // In a real implementation, this would prepare/load sound effects
    // For now, it's just a hook as specified in the requirements
    console.log("Preparing countdown sound effect (hook only)");
  }, []);

  const prepareAnswerSound = useCallback(() => {
    // Prepare answer selection sound
    console.log("Preparing answer sound effect (hook only)");
  }, []);

  const prepareCorrectSound = useCallback(() => {
    // Prepare correct answer sound
    console.log("Preparing correct sound effect (hook only)");
  }, []);

  const prepareWrongSound = useCallback(() => {
    // Prepare wrong answer sound
    console.log("Preparing wrong sound effect (hook only)");
  }, []);

  return {
    prepareCountdownSound,
    prepareAnswerSound,
    prepareCorrectSound,
    prepareWrongSound,
  };
}