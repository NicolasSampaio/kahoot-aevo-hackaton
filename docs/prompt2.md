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
