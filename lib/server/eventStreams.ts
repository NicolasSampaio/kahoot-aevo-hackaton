// In-memory event streams for SSE broadcasting
// IMPORTANT: This is ONLY for MVP and NOT production-ready
// - Not persistent
// - Not safe across multiple instances
// - Will reset on redeploy
// For production: use Redis / database or Ably / Pusher / Supabase Realtime
// This architecture is SSE-based for Vercel compatibility

type StreamController = ReadableStreamDefaultController;

interface RoomStream {
  controllers: Set<StreamController>;
  encoder: TextEncoder;
}

const eventStreams = new Map<string, RoomStream>();

function getOrCreateRoomStream(code: string): RoomStream {
  if (!eventStreams.has(code)) {
    eventStreams.set(code, {
      controllers: new Set(),
      encoder: new TextEncoder(),
    });
  }
  return eventStreams.get(code)!;
}

export function addEventStream(code: string, controller: StreamController): void {
  const roomStream = getOrCreateRoomStream(code);
  roomStream.controllers.add(controller);
}

export function removeEventStream(code: string, controller: StreamController): void {
  const roomStream = eventStreams.get(code);
  if (roomStream) {
    roomStream.controllers.delete(controller);
    if (roomStream.controllers.size === 0) {
      eventStreams.delete(code);
    }
  }
}

export function broadcastToRoom(code: string, data: unknown): void {
  const roomStream = eventStreams.get(code);
  if (!roomStream || roomStream.controllers.size === 0) {
    return;
  }

  const jsonData = `data: ${JSON.stringify(data)}\n\n`;
  const encodedData = roomStream.encoder.encode(jsonData);

  roomStream.controllers.forEach((controller) => {
    try {
      controller.enqueue(encodedData);
    } catch {
      // Controller is closed, remove it
      roomStream.controllers.delete(controller);
    }
  });

  // Clean up if all controllers are gone
  if (roomStream.controllers.size === 0) {
    eventStreams.delete(code);
  }
}

export function getActiveStreamsCount(code: string): number {
  const roomStream = eventStreams.get(code);
  return roomStream?.controllers.size ?? 0;
}

export function cleanupRoom(code: string): void {
  const roomStream = eventStreams.get(code);
  if (roomStream) {
    roomStream.controllers.forEach((controller) => {
      try {
        controller.close();
      } catch {
        // Controller already closed
      }
    });
    eventStreams.delete(code);
  }
}