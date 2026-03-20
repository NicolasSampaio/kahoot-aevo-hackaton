import { useState, useCallback } from "react";
import type { GameState, Question } from "@/types/game";
import { generateSampleQuestions } from "@/lib/game-logic";

interface UseGameStateReturn {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  score: number;
  addScore: (points: number) => void;
  resetScore: () => void;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  nextQuestion: () => void;
  questions: Question[];
}

export function useGameState(): UseGameStateReturn {
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions] = useState<Question[]>(generateSampleQuestions);

  const addScore = useCallback((points: number) => {
    setScore((prev) => prev + points);
  }, []);

  const resetScore = useCallback(() => {
    setScore(0);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const currentQuestion = questions[currentQuestionIndex] || null;

  return {
    gameState,
    setGameState,
    score,
    addScore,
    resetScore,
    currentQuestion,
    currentQuestionIndex,
    nextQuestion,
    questions,
  };
}
