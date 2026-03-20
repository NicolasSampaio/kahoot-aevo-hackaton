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
