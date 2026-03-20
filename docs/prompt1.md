## Prompt 1 — Setup inicial do projeto

```
You are an expert Next.js developer. Bootstrap a new quiz game app called "Kahoot Aevo" with the following stack:
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (for game animations)
- Socket.IO or Pusher (for real-time communication — install the dependency but don't implement yet)

Create the base folder structure following Next.js App Router conventions:
- /app (routes: home, create-room, play, results)
- /components (shared UI: buttons, timers, answer cards, scoreboards)
- /lib (utilities, helpers, game logic)
- /hooks (custom hooks: useTimer, useGameState, useRoom)
- /types (TypeScript interfaces: Room, Player, Question, Answer, GameState)

Define the core TypeScript types in /types/game.ts:
- Room: { id, code, hostId, players[], questions[], status, maxPlayers, currentQuestionIndex }
- Player: { id, name, avatar, score, answers[] }
- Question: { id, text, options[4], correctOptionIndex, timeLimit }
- Answer: { playerId, questionId, selectedOption, timeToAnswer, isCorrect, points }
- GameState: 'waiting' | 'countdown' | 'question' | 'answer-reveal' | 'leaderboard' | 'final-results'

Generate: package.json, tsconfig.json, tailwind.config.ts, and a working /app/layout.tsx with a fun, game-themed global style, and /app/page.tsx as a landing page with a "Create Room" and "Join Room" CTA.

Do not add authentication, database, or real-time logic yet. Focus only on the project skeleton and types.
```

---
