You are an expert frontend and backend engineer.

Polish, stabilize, and finalize the Kahoot Aevo MVP.

---

## 1. UX Improvements

- Add loading states:
  - joining room
  - waiting for players
  - submitting answer

- Add feedback:
  - correct / incorrect answers
  - highlight selected answer

- Add transitions:
  - Framer Motion for:
    - question transitions
    - scoreboard updates

---

## 2. Error states

Handle gracefully:

- Room does not exist
- Game already started
- Duplicate player name
- Connection lost (SSE disconnected)

Show:

- Toasts or inline messages

---

## 3. Realtime resilience

Improve SSE handling:

- Auto-reconnect with exponential backoff
- Detect disconnect and show "Reconnecting..."
- Prevent duplicate events on reconnect

---

## 4. Game edge cases

Handle:

- Player joins mid-game
- Host leaves
- Player refreshes page
- Duplicate submissions

---

## 5. Code quality

- Clean up unused code
- Ensure strict TypeScript types
- Extract reusable components
- Add comments where logic is complex

---

## 6. Performance

- Avoid unnecessary re-renders
- Memoize components when needed
- Optimize state updates in Zustand

---

## 7. Documentation (VERY IMPORTANT)

Update README.md with:

### Architecture

Explain:

- Frontend: Next.js (App Router) on Vercel
- Realtime: **SSE (EventSource)**
- State:
  - Client → Zustand
  - Server → in-memory Map

### Limitations (MVP)

Clearly state:

- In-memory room store:
  - resets on redeploy
  - not shared across instances
- SSE:
  - unidirectional (server → client)

### Production recommendations

Suggest:

- Redis (Upstash)
- Database persistence
- Or hosted realtime:
  - Ably
  - Pusher
  - Supabase Realtime

---

## 8. Final goal

Deliver:

- Smooth gameplay
- Stable real-time sync
- Clean UX
- Clear documentation of limitations and next steps
