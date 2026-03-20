'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { GameState } from '@/types/game';
import { useGameEngine } from '@/hooks/useGameEngine';
import CountdownScreen from '@/components/game/countdown-screen';
import QuestionScreen from '@/components/game/question-screen';
import AnswerRevealScreen from '@/components/game/answer-reveal-screen';
import MiniLeaderboard from '@/components/game/mini-leaderboard';
import FinalResults from '@/components/game/final-results';

export default function RoomPlayPage({ params }: { params: { code: string } }) {
  const router = useRouter();
  const pathname = usePathname();
  const { gameState, currentQuestion, timer, answers, players, score, isHost, 
    handleAnswerSelect, nextQuestion, resetGame } = useGameEngine();

  // Extract code from pathname (e.g., /app/room/ABC123/play)
  const code = pathname.split('/')[2];

  // Auto-advance logic for answer reveal and leaderboard
  useEffect(() => {
    if (gameState === 'answer-reveal' || gameState === 'leaderboard') {
      const timer = setTimeout(() => {
        if (isHost) {
          nextQuestion();
        }
      }, 5000); // 5 seconds
      return () => clearTimeout(timer);
    }
  }, [gameState, isHost, nextQuestion]);

  // Handle time running out
  useEffect(() => {
    if (gameState === 'question' && timer.timeLeft <= 0) {
      // Auto-submit as no answer
      // This would be handled by the game engine when time runs out
    }
  }, [gameState, timer.timeLeft]);

  // Render based on game state
  switch (gameState) {
    case 'countdown':
      return <CountdownScreen />;

    case 'question':
      return (
        <QuestionScreen
          question={currentQuestion}
          timer={timer}
          onAnswerSelect={handleAnswerSelect}
          answers={answers}
        />
      );

    case 'answer-reveal':
      return (
        <AnswerRevealScreen
          question={currentQuestion}
          answers={answers}
          players={players}
          score={score}
          onNextQuestion={nextQuestion}
          isHost={isHost}
        />
      );

    case 'leaderboard':
      return (
        <MiniLeaderboard
          players={players}
          onNextQuestion={nextQuestion}
          isHost={isHost}
        />
      );

    case 'final-results':
      return <FinalResults players={players} onReset={resetGame} />;

    default:
      // Waiting state - show waiting screen or redirect to lobby
      return <div>Waiting for players...</div>;
  }
}