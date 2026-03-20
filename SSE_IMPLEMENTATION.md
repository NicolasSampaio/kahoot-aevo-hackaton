# SSE-Based Real-Time Synchronization Implementation

This document describes the Server-Sent Events (SSE) implementation for the Kahoot Aevo game, designed to work on Vercel without WebSockets.

## Architecture Overview

```
┌─────────────┐     SSE Stream      ┌─────────────┐
│   Client    │ ◄────────────────── │   Server    │
│  (Browser)  │                     │  (Next.js)  │
└─────────────┘                     └─────────────┘
       │                                   │
       │ REST API                          │ In-Memory
       │ (POST requests)                   │ Store
       ▼                                   ▼
┌─────────────┐                     ┌─────────────┐
│ Zustand     │                     │ roomStore   │
│ gameStore   │                     │ eventStreams│
└─────────────┘                     └─────────────┘
```

## Key Components

### 1. Server-Side Store (`/lib/server/`)

#### roomStore.ts
- In-memory Map-based room storage
- Helper functions for room operations
- **WARNING**: Not persistent, resets on redeploy

#### eventStreams.ts  
- Manages SSE connections per room
- Broadcasts events to all connected clients
- Uses ReadableStream controllers

### 2. SSE Endpoint (`/app/api/rooms/[code]/events/route.ts`)

- Returns `text/event-stream` response
- Sends heartbeat every 15 seconds
- Handles connection cleanup on abort
- Events: `initial_state`, `heartbeat`

### 3. REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/rooms/create` | POST | Create new room |
| `/api/rooms/join` | POST | Join existing room |
| `/api/rooms/start` | POST | Start the game |
| `/api/rooms/answer` | POST | Submit answer |
| `/api/rooms/next` | POST | Advance to next question |

### 4. Client-Side State Management

#### Zustand Store (`/lib/store/gameStore.ts`)
- Global game state
- Player management
- Score tracking
- Connection state

#### SSE Hook (`/hooks/useRoomEvents.ts`)
- Manages EventSource connection
- Handles all SSE events
- Auto-reconnection with exponential backoff
- Max 10 reconnection attempts

## SSE Event Types

- `initial_state` - Room state on connection
- `player_joined` - New player joined
- `game_started` - Game began
- `question_changed` - Moved to next question
- `answer_submitted` - Player submitted answer
- `scores_updated` - Scores updated
- `game_finished` - Game ended
- `heartbeat` - Keep-alive ping

## Usage Example

```tsx
import { useRoomEvents } from '@/hooks/useRoomEvents';
import { useGameStore } from '@/lib/store/gameStore';

function GameRoom({ code }: { code: string }) {
  const { isConnected, error, reconnect } = useRoomEvents({
    code,
    playerId: 'player-id',
    autoReconnect: true,
    maxReconnectAttempts: 10,
  });

  const room = useGameStore((state) => state.room);
  const players = useGameStore((state) => state.players);

  if (!isConnected) {
    return <div>Connecting...</div>;
  }

  return (
    <div>
      <h1>Room: {room?.code}</h1>
      <p>Players: {players.length}</p>
      {error && <button onClick={reconnect}>Reconnect</button>}
    </div>
  );
}
```

## Production Considerations

**IMPORTANT**: This is an MVP implementation with in-memory storage.

For production deployment, replace:
- In-memory store → Redis / Database
- In-memory event streams → Ably / Pusher / Supabase Realtime

The SSE architecture is Vercel-compatible and production-ready, but the storage layer needs to be stateless for horizontal scaling.

## Vercel Compatibility

✅ Uses Server-Sent Events (not WebSockets)
✅ Stateless-friendly design
✅ No long-running servers
✅ Works with Vercel's serverless architecture
