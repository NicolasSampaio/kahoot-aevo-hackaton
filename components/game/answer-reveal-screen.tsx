import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameEngine } from '@/hooks/useGameEngine';

interface AnswerRevealProps {
  question: any; // Question type from types/game
  answers: any[]; // Answer[] type
  players: any[]; // Player[] type
  score: number;
  onNextQuestion: () => void;
  isHost: boolean;
}

export default function AnswerRevealScreen({ 
  question, 
  answers, 
  players, 
  score, 
  onNextQuestion, 
  isHost 
}: AnswerRevealProps) {
  const { addScore } = useGameEngine(); // We might not need to add score here as it's already added in handleAnswerSelect

  // Calculate statistics for the bar chart
  const optionCounts = [0, 0, 0, 0];
  answers.forEach(answer => {
    if (answer.selectedOption !== null) {
      optionCounts[answer.selectedOption] += 1;
    }
  });

  const totalAnswers = answers.length;
  const optionPercentages = optionCounts.map(count => 
    totalAnswers > 0 ? (count / totalAnswers) * 100 : 0
  );

  // Determine if the local player answered correctly
  // For simplicity, we assume the local player is the first player in the list (in a real app, we'd have a way to identify the local player)
  const localPlayer = players[0];
  const localPlayerAnswer = answers.find(ans => ans.playerId === localPlayer.id);
  const isCorrect = localPlayerAnswer?.isCorrect || false;
  const pointsEarned = localPlayerAnswer?.points || 0;

  useEffect(() => {
    // Confetti or shake animation would be triggered here
    // For now, we just note that the effect runs once when the component mounts
  }, [isCorrect]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      {/* Question */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="text-2xl font-bold text-center mb-8"
      >
        {question.text}
      </motion.div>

      {/* Correct answer highlight */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.4 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-4">
          {/* Shape icon for correct answer */}
          <div className="text-5xl">
            {['▲', '◆', '●', '■'][question.correctOptionIndex]}
          </div>
          <div className="text-xl font-medium">
            Correct Answer: {question.options[question.correctOptionIndex]}
          </div>
        </div>
      </motion.div>

      {/* Bar chart for answer distribution */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.6 }}
        className="w-full max-w-2xl mb-8"
      >
        {question.options.map((option: string, index: number) => (
          <div key={index} className="flex items-center mb-4">
            {/* Shape icon */}
            <div className="w-10 h-10 flex items-center justify-center text-xl mr-4">
              {['▲', '◆', '●', '■'][index]}
            </div>
            {/* Bar container */}
            <div className="flex-1 bg-gray-800 rounded-full h-4 overflow-hidden">
<motion.div
                    className={`h-full bg-${['red', 'blue', 'green', 'yellow'][index]}-500 rounded-full`}
                    style={{ width: optionPercentages[index] + '%' }}
                    initial={{ width: 0 }}
                    animate={{ width: optionPercentages[index] + '%' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  ></motion.div>
            </div>
            {/* Percentage text */}
            <div className="ml-4 w-16 text-right text-sm">
              {optionPercentages[index].toFixed(0)}% ({optionCounts[index]})
            </div>
          </div>
        ))}
      </motion.div>

      {/* Player result */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.8 }}
        className="text-center mb-12"
      >
        {isCorrect ? (
          <>
            <div className="text-4xl font-bold text-green-400 mb-2">
              Correct!
            </div>
            <div className="text-2xl">
              +{pointsEarned} pts
            </div>
          </>
        ) : (
          <>
            <div className="text-4xl font-bold text-red-400 mb-2">
              Wrong!
            </div>
            <div className="text-2xl">
              +0 pts
            </div>
          </>
        )}
      </motion.div>

      {/* Next question button or auto-advance notice */}
      {isHost ? (
        <motion.button
          onClick={onNextQuestion}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.0 }}
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-transform duration-200"
          whileTap={{ scale: 0.95 }}
        >
          Next Question
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 1.0 }}
          className="text-xl text-center"
        >
          Next question in 5 seconds...
        </motion.div>
      )}
    </div>
  );
}