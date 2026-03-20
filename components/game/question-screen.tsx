import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import QuestionDisplay from './question-display';
import AnswerCard from './answer-card';
import TimerBar from './timer-bar';
import { useGameEngine } from '@/hooks/useGameEngine';

interface QuestionScreenProps {
  question: any; // Question type from types/game
  timer: { timeLeft: number; isRunning: boolean };
  onAnswerSelect: (playerId: string, questionId: string, selectedOption: number, timeToAnswer: number) => void;
  answers: any[]; // Answer[] type
}

export default function QuestionScreen({ 
  question, 
  timer, 
  onAnswerSelect, 
  answers 
}: QuestionScreenProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [answerTime, setAnswerTime] = useState<number | null>(null);
  
  const { addScore } = useGameEngine(); // We'll use this to add points when answer is submitted
  
  // Simulate player ID (in a real app, this would come from auth/context)
  const playerId = "local-player"; 
  
  // Calculate time to answer when an answer is selected
  useEffect(() => {
    if (selectedOption !== null && answerTime === null) {
      // In a real implementation, we'd track when the question started
      // For now, we'll estimate based on time left
      const timeToAnswer = 20 - timer.timeLeft; // Assuming 20s default
      setAnswerTime(timeToAnswer);
      
      // Lock the answer after a brief delay to show selection animation
      setIsLocked(true);
      
      // Submit answer after selection delay
      setTimeout(() => {
        onAnswerSelect(playerId, question.id, selectedOption, timeToAnswer);
      }, 300);
    }
  }, [selectedOption, answerTime, timer.timeLeft, question.id, onAnswerSelect]);

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6"
    >
      {/* Question Display */}
      <QuestionDisplay question={question.text} />
      
      {/* Timer Bar and Text */}
      <div className="w-full max-w-2xl mb-6">
        <TimerBar 
          timeLeft={timer.timeLeft} 
          totalTime={question.timeLimit} 
        />
        <div className="mt-2 text-center text-lg font-medium">
          {timer.timeLeft}s
        </div>
      </div>
      
      {/* Answer Options Grid */}
      <div className="w-full max-w-2xl grid grid-cols-2 gap-6">
        {question.options.map((option: string, index: number) => (
          <AnswerCard
            key={index}
            text={option}
            index={index}
            isSelected={selectedOption === index}
            isLocked={isLocked}
            onSelect={() => {
              if (!isLocked) {
                setSelectedOption(index);
              }
            }}
          />
        ))}
      </div>
      
      {/* Answer submitted feedback */}
      {isLocked && selectedOption !== null && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="mt-8 text-xl font-medium text-center"
        >
          Answer locked in!
        </motion.div>
      )}
      
      {/* Time's up notice */}
      {!isLocked && timer.timeLeft <= 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          className="mt-8 text-xl font-medium text-center text-red-400"
        >
          Time's up!
        </motion.div>
      )}
    </motion.div>
  );
}