// SSE endpoint for real-time room updates
// IMPORTANT: This uses SSE (Server-Sent Events) for Vercel compatibility
// This architecture is SSE-based for Vercel compatibility
// For production: use Redis / database or Ably / Pusher / Supabase Realtime

import { getRoom } from "@/lib/server/roomStore";
import {
  broadcastToRoom,
  addEventStream,
  removeEventStream,
} from "@/lib/server/eventStreams";

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  const { code } = await Promise.resolve(params);

  // Check if room exists
  const room = getRoom(code);
  if (!room) {
    return new Response(
      JSON.stringify({ error: "Room not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  const encoder = new TextEncoder();
  let heartbeatInterval: NodeJS.Timeout | null = null;

  // Create SSE response stream
  const stream = new ReadableStream({
    start(controller) {
      // Add this stream to the room's event streams
      addEventStream(code, controller);

      // Send initial room state
      try {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "initial_state",
              payload: room,
            })}\n\n`
          )
        );
      } catch {
        // Controller might be closed immediately
        removeEventStream(code, controller);
        return;
      }

      // Send heartbeat every 15 seconds to keep connection alive
      heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "heartbeat", payload: {} })}\n\n`
            )
          );
        } catch {
          // Controller closed, clear interval
          if (heartbeatInterval) {
            clearInterval(heartbeatInterval);
            heartbeatInterval = null;
          }
          removeEventStream(code, controller);
        }
      }, 15000);

      // Clean up on abort
      const abortHandler = () => {
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = null;
        }
        removeEventStream(code, controller);
        try {
          controller.close();
        } catch {
          // Controller already closed
        }
      };

      request.signal.addEventListener("abort", abortHandler);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
