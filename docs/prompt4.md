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
