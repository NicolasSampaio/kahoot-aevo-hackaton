import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Player, Question } from '@/types/game';

interface QuestionBreakdownProps {
  questions: Question[];
  players: Player[];
}

export default function QuestionBreakdown({ questions, players }: QuestionBreakdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const totalPlayers = players.length;

  // Calculate answer distribution for each question
  const questionStats = questions.map((q, index) => {
    const distribution = new Array(q.options.length).fill(0);
    players.forEach(player => {
      const playerAnswer = player.answers?.[index];
      if (playerAnswer && playerAnswer.selectedOption !== null && playerAnswer.selectedOption >= 0 && playerAnswer.selectedOption < q.options.length) {
        distribution[playerAnswer.selectedOption] = (distribution[playerAnswer.selectedOption] || 0) + 1;
      }
    });
    const correctCount = distribution[q.correctOptionIndex] || 0;
    const percentage = Math.round((correctCount / totalPlayers) * 100);
    return {
      ...q,
      answerDistribution: distribution,
      correctCount,
      percentage
    };
  });

  // Find hardest (lowest percentage) and easiest (highest percentage)
  let hardestIndex = 0;
  let easiestIndex = 0;
  let lowestPercentage = 100;
  let highestPercentage = 0;

  questionStats.forEach((stat, index) => {
    if (stat.percentage < lowestPercentage) {
      lowestPercentage = stat.percentage;
      hardestIndex = index;
    }
    if (stat.percentage > highestPercentage) {
      highestPercentage = stat.percentage;
      easiestIndex = index;
    }
  });

  return (
    <div className="mb-8">
      <div
        className="flex justify-between items-center w-full cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="font-semibold">Question Breakdown</h3>
        <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </div>
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {questionStats.map((q, index) => (
            <div key={q.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">Q{index + 1}: {q.text}</h4>
                <div className="flex space-x-2 text-sm">
                  {index === hardestIndex && (
                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Hardest</span>
                  )}
                  {index === easiestIndex && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Easiest</span>
                  )}
                </div>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600">Correct Answer: <span className="font-medium">{q.options[q.correctOptionIndex]}</span></p>
              </div>
              <div className="mb-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">{q.percentage}%</span> of players got it right
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-indigo-600 h-full rounded-full"
                    style={{ width: `${q.percentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-xs text-gray-500">
                {q.answerDistribution.map((count: number, optIndex: number) => (
                  <span key={optIndex} className="mr-2">
                    {q.options[optIndex]}: {count} players
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
