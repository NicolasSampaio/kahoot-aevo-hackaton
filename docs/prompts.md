# OpenCode Prompts — Kahoot Aevo

Prompts para construir um app de quiz estilo Kahoot com Next.js + React do zero.
Use **um prompt por sessão** no OpenCode, validando o resultado antes de avançar.

**Diferenciais do projeto:** ranking local, animações divertidas, feedback imediato.

---

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

## Prompt 2 — Tela de criação e entrada na sala

```
Create the room creation and joining flow for Kahoot Aevo using Next.js App Router and shadcn/ui.

Requirements:

**Create Room page (/app/create-room/page.tsx):**
- Form to set: room name, max number of players (2-50), and a list of questions
- Each question has: text, 4 answer options (A/B/C/D), correct answer selection, time limit (10/15/20/30 seconds)
- Ability to add/remove questions dynamically (minimum 3 questions)
- "Create Room" button that generates a 6-digit room code and redirects to the host lobby
- Store room data in React state for now (no backend)

**Join Room page (/app/join/page.tsx):**
- Input field for the 6-digit room code
- Input field for player name
- Fun avatar selector (6-8 emoji-based avatars)
- "Join" button that redirects to the waiting lobby

**Waiting Lobby (/app/room/[code]/lobby/page.tsx):**
- Shows room code prominently (big text, easy to share)
- Live list of joined players with their avatars
- Host sees a "Start Game" button (enabled when at least 2 players joined)
- Players see "Waiting for host to start..." with a pulse animation
- Use Framer Motion for player join animations (slide-in, bounce)

Components:
- /components/room/question-form.tsx
- /components/room/player-card.tsx
- /components/room/avatar-picker.tsx
- /components/room/room-code-display.tsx

All data is local state for now. No API routes or database.
```

---

## Prompt 3 — Fluxo do jogo (perguntas, timer, respostas)

```
Create the core gameplay flow for Kahoot Aevo.

The game follows this state machine:
waiting → countdown → question → answer-reveal → (repeat or final-results)

**Countdown screen (/app/room/[code]/play/page.tsx — state: countdown):**
- 3-2-1 animated countdown with large numbers, scale + fade animations (Framer Motion)
- Background color changes per number
- Sound-ready hooks (prepareSoundEffect) — don't implement audio yet, just the hook

**Question screen (state: question):**
- Question text displayed prominently at the top
- 4 answer option cards in a 2x2 grid, each with a distinct color (red, blue, green, yellow) and shape icon (triangle, diamond, circle, square) — Kahoot style
- Countdown timer bar that shrinks from full to empty (animated)
- Timer text showing seconds remaining
- Players tap an answer card to submit — card gets a selected state animation
- Once answered, show "Answer locked in!" with a check animation
- If time runs out without answering, auto-submit as "no answer"

**Answer Reveal screen (state: answer-reveal):**
- Show which answer was correct with a highlight animation
- Show how many players picked each option (bar chart per option)
- Each player sees: "Correct! +1000 pts" or "Wrong!" with appropriate animation (confetti vs shake)
- Points calculation: base points (1000) × speed bonus (faster answer = more points, linear from 1.0x to 0.5x)
- "Next Question" button for host / auto-advance after 5 seconds

**Mini Leaderboard (between questions):**
- Top 5 players with scores, animated bar race style
- Position change indicators (↑↓) with slide animations
- 3-second display before next question countdown

Components:
- /components/game/question-display.tsx
- /components/game/answer-card.tsx (with color variants)
- /components/game/timer-bar.tsx
- /components/game/answer-reveal.tsx
- /components/game/mini-leaderboard.tsx
- /hooks/useGameEngine.ts (state machine logic)
- /hooks/useTimer.ts (countdown hook)
- /lib/scoring.ts (points calculation)

Use mock data with 5 sample questions. All game state managed locally via useReducer.
Keep all animations performant (transform/opacity only, no layout shifts).
```

---

## Prompt 4 — Tela de resultados finais e ranking

```
Create the final results and ranking screen for Kahoot Aevo.

**Final Results page (/app/room/[code]/results/page.tsx):**

1. Podium animation (staggered reveal):
   - 3rd place slides up first (bronze, left)
   - 2nd place slides up (silver, right)
   - 1st place slides up last (gold, center, tallest) with confetti explosion
   - Each podium block shows: player avatar, name, total score
   - Use Framer Motion spring animations with staggered delays

2. Full Leaderboard (below podium):
   - Ranked list of ALL players with position, avatar, name, score
   - Score bars showing relative performance
   - Stats per player: correct answers / total, average response time, longest streak
   - Highlight the current player's row

3. Question Breakdown (expandable section):
   - List each question with: text, correct answer, % of players who got it right
   - Hardest question badge, easiest question badge

4. Action buttons:
   - "Play Again" (host only) — resets game with same questions
   - "New Game" (host) — redirects to create-room
   - "Share Results" — copies a text summary to clipboard
   - "Back to Home" — redirects to landing page

**Animations (Framer Motion):**
- Confetti component using canvas: 200 particles, gravity, random colors matching the game palette
- Score count-up animation (numbers rolling from 0 to final)
- Podium blocks spring up with overshoot
- Leaderboard rows stagger in from the side

Components:
- /components/results/podium.tsx
- /components/results/full-leaderboard.tsx
- /components/results/question-breakdown.tsx
- /components/results/confetti.tsx
- /components/results/score-counter.tsx

All data comes from local game state. No API.
```

---

## Prompt 5 — Estado global e comunicação real-time

```
Add real-time multiplayer support and global state management to Kahoot Aevo.

Requirements:

**State Management (Zustand):**
- Install and configure Zustand
- Create /lib/store/game-store.ts with slices:
  - roomSlice: room data, players list, questions
  - gameSlice: current state, current question index, timer, answers received
  - playerSlice: current player info, score, answer history
- Migrate all component-local state to the Zustand store
- Add computed selectors: currentQuestion, playerRanking, isHost

**API Routes (Next.js Route Handlers):**
- POST /api/rooms — create a room, return room code
- GET /api/rooms/[code] — get room data
- POST /api/rooms/[code]/join — add player to room
- POST /api/rooms/[code]/start — host starts the game
- POST /api/rooms/[code]/answer — player submits an answer
- GET /api/rooms/[code]/state — get current game state

**Real-time with Server-Sent Events (SSE) or WebSocket:**
- Use a simple in-memory store (Map<string, Room>) on the server for now
- SSE endpoint: GET /api/rooms/[code]/events — streams game state changes
- Events: player-joined, game-started, next-question, answer-reveal, game-ended
- Create /hooks/useRoomEvents.ts that connects to the SSE stream and updates Zustand store
- Handle reconnection with exponential backoff

**File structure:**
- /lib/store/game-store.ts
- /lib/server/room-manager.ts (in-memory room CRUD)
- /app/api/rooms/route.ts
- /app/api/rooms/[code]/route.ts
- /app/api/rooms/[code]/join/route.ts
- /app/api/rooms/[code]/start/route.ts
- /app/api/rooms/[code]/answer/route.ts
- /app/api/rooms/[code]/events/route.ts
- /hooks/useRoomEvents.ts

Do not add a database yet. In-memory storage is fine for the MVP.
Do not change UI components — only wire them to the new store and API.
```

---

## Prompt 6 — Polish final do MVP

```
Review the entire Kahoot Aevo project and apply final MVP polish:

1. **Error handling:**
   - Add loading.tsx and error.tsx to all game routes
   - Handle edge cases: room full, room not found, game already started, host disconnected
   - Show friendly error messages with "Try Again" actions

2. **Responsiveness:**
   - Ensure all pages work on mobile (375px) — this is the PRIMARY device for players
   - Answer cards must be large tap targets (min 48px height)
   - Room code must be easily readable from a distance (for projection)
   - Desktop layout (1280px) for the host/projector view

3. **Accessibility & UX:**
   - Color-coded answers also have shape icons (for color-blind players)
   - Keyboard navigation support (1-2-3-4 for answer selection)
   - Haptic feedback hooks (navigator.vibrate) on answer selection
   - Screen reader labels on interactive elements

4. **Performance:**
   - Ensure all animations use transform/opacity only (GPU-accelerated)
   - Lazy load the confetti component
   - Add proper React.memo on answer cards and leaderboard rows

5. **Metadata & SEO:**
   - Add metadata (title, description, og:image) to layout.tsx and key pages
   - Add a fun favicon and PWA manifest for mobile "Add to Home Screen"

6. **Project documentation:**
   - Add a 404 not-found.tsx page with a fun "quiz not found" theme
   - Remove all console.log statements
   - Ensure TypeScript has no errors (run tsc --noEmit mentally)
   - Add a README.md with: overview, how to install, how to run, how to create a room, tech stack

List every file you create or modify.
```

---

## Dicas de uso no OpenCode

- **Use um prompt por sessão** — não misture setup com gameplay no mesmo prompt
- **Após cada prompt, rode o projeto** e valide antes de passar pro próximo
- **O Prompt 3 é o mais pesado** — se necessário, divida em 3a (countdown + question) e 3b (answer-reveal + leaderboard)
- **Se travar em algum ponto**, adicione no início do próximo prompt:

```
Here is the current state of the project. These files exist and work correctly: [list files].
The issue I'm facing is: [describe problem].
Continue from where we left off and fix the issue before proceeding.
```

- **Para testar multiplayer localmente:** abra 2-3 abas do navegador, uma como host e as outras como jogadores
- **Ordem de prioridade se precisar cortar escopo:** Prompt 1 → 2 → 3 → 4 → 6 → 5 (real-time é o mais complexo, pode ser o último)

#F2722A
#000
#FFFFFF
