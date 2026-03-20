import type { Question } from "@/types/game";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function generateSampleQuestions(): Question[] {
  return [
    {
      id: "1",
      text: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctOptionIndex: 2,
      timeLimit: 20,
    },
    {
      id: "2",
      text: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctOptionIndex: 1,
      timeLimit: 20,
    },
    {
      id: "3",
      text: "What is 7 × 8?",
      options: ["54", "56", "58", "64"],
      correctOptionIndex: 1,
      timeLimit: 15,
    },
    {
      id: "4",
      text: "Who painted the Mona Lisa?",
      options: ["Michelangelo", "Leonardo da Vinci", "Raphael", "Donatello"],
      correctOptionIndex: 1,
      timeLimit: 20,
    },
    {
      id: "5",
      text: "What is the largest ocean on Earth?",
      options: ["Atlantic", "Indian", "Arctic", "Pacific"],
      correctOptionIndex: 3,
      timeLimit: 20,
    },
  ];
}

export function checkAnswer(
  selectedOption: number,
  correctOptionIndex: number
): boolean {
  return selectedOption === correctOptionIndex;
}
