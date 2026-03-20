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
