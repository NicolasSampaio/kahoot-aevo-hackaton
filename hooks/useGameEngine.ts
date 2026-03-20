import { useReducer, useCallback, useRef, useEffect } from 'react';
import type { GameState, Question, Player, Answer } from '@/types/game';
import { generateSampleQuestions } from '@/lib/game-logic';
import { calculatePoints } from '@/lib/scoring';

// Define the initial state
interface GameStateType {
  gameState: GameState;
  score: number;
  currentQuestionIndex: number;
  questions: Question[];
  players: Player[];
  answers: Answer[];
  timer: {
    timeLeft: number;
    isRunning: boolean;
  };
  isHost: boolean;
}

// Action types
type GameAction =
  | { type: 'SET_GAME_STATE'; payload: GameState }
  | { type: 'SET_SCORE'; payload: number }
  | { type: 'ADD_SCORE'; payload: number }
  | { type: 'RESET_SCORE' }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'SET_CURRENT_QUESTION_INDEX'; payload: number }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'REMOVE_PLAYER'; payload: string } // playerId
  | { type: 'SET_ANSWERS'; payload: Answer[] }
  | { type: 'ADD_ANSWER'; payload: Answer }
  | { type: 'SET_TIMER'; payload: { timeLeft: number; isRunning: boolean } }
  | { type: 'START_TIMER'; payload: number } // duration
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER'; payload: number } // duration
  | { type: 'SET_IS_HOST'; payload: boolean }
  | { type: 'RESET_GAME' };

// Reducer function
function gameReducer(state: GameStateType, action: GameAction): GameStateType {
  switch (action.type) {
    case 'SET_GAME_STATE':
      return { ...state, gameState: action.payload };
    case 'SET_SCORE':
      return { ...state, score: action.payload };
    case 'ADD_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'RESET_SCORE':
      return { ...state, score: 0 };
    case 'NEXT_QUESTION':
      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        answers: [], // Clear answers for next question
      };
    case 'PREV_QUESTION':
      return {
        ...state,
        currentQuestionIndex: Math.max(0, state.currentQuestionIndex - 1),
        answers: [], // Clear answers for previous question
      };
    case 'SET_CURRENT_QUESTION_INDEX':
      return {
        ...state,
        currentQuestionIndex: action.payload,
        answers: [], // Clear answers when setting index
      };
    case 'SET_PLAYERS':
      return { ...state, players: action.payload };
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] };
    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.payload),
      };
    case 'SET_ANSWERS':
      return { ...state, answers: action.payload };
    case 'ADD_ANSWER':
      return { ...state, answers: [...state.answers, action.payload] };
    case 'SET_TIMER':
      return { ...state, timer: action.payload };
    case 'START_TIMER':
      return {
        ...state,
        timer: {
          timeLeft: action.payload,
          isRunning: true,
        },
      };
    case 'PAUSE_TIMER':
      return {
        ...state,
        timer: {
          ...state.timer,
          isRunning: false,
        },
      };
    case 'RESET_TIMER':
      return {
        ...state,
        timer: {
          timeLeft: action.payload,
          isRunning: false,
        },
      };
    case 'SET_IS_HOST':
      return { ...state, isHost: action.payload };
    case 'RESET_GAME':
      return {
        gameState: 'waiting',
        score: 0,
        currentQuestionIndex: 0,
        questions: generateSampleQuestions,
        players: [],
        answers: [],
        timer: { timeLeft: 20, isRunning: false },
        isHost: false,
      };
    default:
      return state;
  }
}

// Custom hook
export function useGameEngine() {
  const [state, dispatch] = useReducer(gameReducer, {
    gameState: 'waiting',
    score: 0,
    currentQuestionIndex: 0,
    questions: generateSampleQuestions,
    players: [],
    answers: [],
    timer: { timeLeft: 20, isRunning: false },
    isHost: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (state.timer.isRunning && state.timer.timeLeft > 0) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'SET_TIMER', payload: {
          timeLeft: state.timer.timeLeft - 1,
          isRunning: state.timer.timeLeft > 1,
        }});
        
        // If time runs out, we could auto-submit or handle in the component
        if (state.timer.timeLeft <= 1) {
          // Time's up - this would be handled by the component
          // For now, we just stop the timer
          dispatch({ type: 'PAUSE_TIMER' });
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [state.timer.isRunning, state.timer.timeLeft]);

  // Actions
  const setGameState = useCallback((state: GameState) => {
    dispatch({ type: 'SET_GAME_STATE', payload: state });
  }, []);

  const setScore = useCallback((score: number) => {
    dispatch({ type: 'SET_SCORE', payload: score });
  }, []);

  const addScore = useCallback((points: number) => {
    dispatch({ type: 'ADD_SCORE', payload: points });
  }, []);

  const resetScore = useCallback(() => {
    dispatch({ type: 'RESET_SCORE' });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const handleAnswerSelect = useCallback((playerId: string, questionId: string, selectedOption: number, timeToAnswer: number) => {
    // Find the question to check correctness
    const currentQuestion = state.questions[state.currentQuestionIndex];
    if (!currentQuestion) return;

    const isCorrect = selectedOption === currentQuestion.correctOptionIndex;
    const points = calculatePoints(isCorrect, timeToAnswer, currentQuestion.timeLimit);

    // Create answer object
    const answer: Answer = {
      playerId,
      questionId: currentQuestion.id,
      selectedOption,
      timeToAnswer,
      isCorrect,
      points,
    };

    // Add answer
    dispatch({ type: 'ADD_ANSWER', payload: answer });

    // Add score to the player (we need to update the player's score)
    // For simplicity, we'll just update the local player's score here
    // In a real app, we'd update the player in the players array
    // But for now, we'll just add to the score state
    dispatch({ type: 'ADD_SCORE', payload: points });
  }, [state.questions, state.currentQuestionIndex]);

  // Get current question
  const currentQuestion = state.questions[state.currentQuestionIndex] || null;

  // Return the state and actions
  return {
    gameState: state.gameState,
    score: state.score,
    currentQuestionIndex: state.currentQuestionIndex,
    questions: state.questions,
    players: state.players,
    answers: state.answers,
    timer: state.timer,
    isHost: state.isHost,
    currentQuestion,
    setGameState,
    setScore,
    addScore,
    resetScore,
    nextQuestion,
    resetGame,
    handleAnswerSelect,
  };
}