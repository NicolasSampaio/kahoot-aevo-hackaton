/**
 * Calculate points based on correctness and speed
 * Base points: 1000
 * Speed bonus: linear from 1.0x (fastest) to 0.5x (slowest)
 * Formula: basePoints × (0.5 + 0.5 × (timeLeft / timeLimit))
 */

export function calculatePoints(
  isCorrect: boolean,
  timeToAnswer: number,
  timeLimit: number
): number {
  // If answer is incorrect, no points
  if (!isCorrect) {
    return 0;
  }

  // Base points
  const basePoints = 1000;

  // Speed bonus calculation
  // Faster answers get higher multiplier (1.0x to 0.5x)
  // When timeToAnswer = 0 (instant), multiplier = 1.0
  // When timeToAnswer = timeLimit, multiplier = 0.5
  const speedMultiplier = 0.5 + 0.5 * ((timeLimit - timeToAnswer) / timeLimit);

  // Ensure multiplier is within bounds
  const finalMultiplier = Math.max(0.5, Math.min(1.0, speedMultiplier));

  // Calculate final points
  return Math.floor(basePoints * finalMultiplier);
}