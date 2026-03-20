import { useParams } from 'next/navigation';
import { useGameState } from '@/hooks/useGameState';
import Podium from '@/components/results/podium';
import FullLeaderboard from '@/components/results/full-leaderboard';
import QuestionBreakdown from '@/components/results/question-breakdown';
import Confetti from '@/components/results/confetti';
import ScoreCounter from '@/components/results/score-counter';
import { Button } from '@/components/ui/button';

export default function ResultsPage() {
  const params = useParams<{ code: string }>();
  const { gameState, players, questions } = useGameState();

  if (!gameState || !players || !questions) {
    return <div>Loading...</div>;
  }

  // Calculate final scores and ranking
  const rankedPlayers = [...players].sort((a, b) => b.score - a.score);

  // Find current player (assuming we have a way to identify the current user)
  // For now, we'll highlight the first player as placeholder - in real app, we'd compare with user ID
  const currentPlayerId = players[0]?.id; // Placeholder

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Podium */}
        <Podium players={rankedPlayers.slice(0, 3)} />
        
        {/* Confetti for winner (only show if we have at least one player)}}
        {rankedPlayers.length > 0 && <Confetti />}

        {/* Full Leaderboard */}
        <FullLeaderboard players={rankedPlayers} currentPlayerId={currentPlayerId} />

        {/* Question Breakdown */}
        <QuestionBreakdown questions={questions} players={players} />

        {/* Action Buttons */}
        <div className="flex flex-col space-y-4 mt-8">
          {gameState.isHost && (
            <>
              <Button 
                variant="outline"
                onClick={() => {
                  // Reset game with same questions
                  // This would be handled by game state logic
                }}
              >
                Play Again
              </Button>
              <Button 
                onClick={() => {
                  // Redirect to create-room
                  // In Next.js, we'd use useRouter or navigate
                }}
              >
                New Game
              </Button>
            </>
          )}
          <Button 
            onClick={() => {
              // Copy results to clipboard
              const resultsText = generateResultsText(rankedPlayers, questions);
              navigator.clipboard.writeText(resultsText);
            }}
          >
            Share Results
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              // Redirect to landing page
              // In Next.js, we'd use useRouter or navigate
            }}
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}

function generateResultsText(rankedPlayers: any[], questions: any[]): string {
  let text = 'Kahoot Aevo - Game Results\n\n';
  text += '🏆 Podium:\n';
  rankedPlayers.slice(0, 3).forEach((player, index) => {
    const medal = ['🥇', '🥈', '🥉'][index];
    text += `${medal} ${player.name}: ${player.score} points\n`;
  });
  
  text += '\n📊 Full Leaderboard:\n';
  rankedPlayers.forEach((player, index) => {
    text += `${index + 1}. ${player.name}: ${player.score} points\n`;
  });
  
  text += '\n❓ Question Breakdown:\n';
  questions.forEach((q: any, index: number) => {
    const correctAnswerIndex = q.correctAnswer;
    const correctAnswerText = q.options[correctAnswerIndex];
    const correctCount = q.answerDistribution?.[correctAnswerIndex] || 0;
    const percentage = Math.round((correctCount / q.totalPlayers) * 100);
    
    text += `Q${index + 1}: ${q.text}\n`;
    text += `   Correct Answer: ${correctAnswerText}\n`;
    text += `   % Correct: ${percentage}%\n\n`;
  });
  
  return text;
}