You are an expert full-stack developer.

Implement real-time synchronization for the Kahoot Aevo game using **Server-Sent Events (SSE)**.

IMPORTANT CONSTRAINTS:

- The app will be deployed on **Vercel**
- DO NOT use Socket.IO or custom WebSocket servers
- Use **SSE (EventSource)** for real-time updates
- Server must be stateless-friendly (but we will use in-memory store for MVP)

---

## 1. Server-side room store

Create a simple in-memory store:

/lib/server/roomStore.ts

- Use:
  const rooms = new Map<string, Room>()

- Each room should contain:
  - players
  - current question index
  - answers
  - scores
  - status (lobby, playing, results)

IMPORTANT:

- This is ONLY for MVP
- Add comments warning:
  - Not persistent
  - Not safe across multiple instances
  - Will reset on redeploy

---

## 2. SSE endpoint

Create route:

/app/api/rooms/[code]/events/route.ts

- Use Response with:
  headers:
  Content-Type: text/event-stream
  Cache-Control: no-cache
  Connection: keep-alive

- Keep connection open

- Send events:
  - player_joined
  - game_started
  - question_changed
  - answer_submitted
  - scores_updated
  - game_finished

- Format:
  data: JSON.stringify({ type, payload })

- Send heartbeat every ~15 seconds

---

## 3. REST endpoints

Create API routes:

POST /api/rooms/create
POST /api/rooms/join
POST /api/rooms/start
POST /api/rooms/answer

Each route should:

- Update roomStore
- Broadcast event to SSE clients

---

## 4. SSE client hook

Create:

/hooks/useRoomEvents.ts

- Use EventSource:
  const source = new EventSource(`/api/rooms/${code}/events`)

- Handle:
  - open
  - message
  - error

- Parse events and update global state

- Implement reconnection:
  - exponential backoff
  - auto-reconnect

---

## 5. Global game store

Create:

/lib/store/gameStore.ts

Use Zustand:

State:

- room
- players
- currentQuestion
- answers
- scores
- status

Actions:

- setRoom
- addPlayer
- updateGameState
- submitAnswer
- updateScores

---

## 6. Integration

- Replace local mock state (useRoom, useGameEngine)
- Connect:
  - API → roomStore
  - SSE → Zustand store

---

## 7. Error handling

Handle:

- room not found
- duplicate player
- invalid answer
- connection loss

---

## 8. Notes (VERY IMPORTANT)

Add comments in code explaining:

- This architecture is **SSE-based for Vercel compatibility**
- In-memory store is NOT production-ready
- For production:
  - use Redis / database
  - or use Ably / Pusher / Supabase Realtime

---

Goal:
Deliver a working MVP with real-time gameplay that works on Vercel without WebSockets.
