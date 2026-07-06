import { NextRequest } from 'next/server';

const clients = new Set<(data: string) => void>();

export function broadcastEvent(event: string, data: any) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const send of clients) {
    try { send(message); } catch { clients.delete(send); }
  }
}

export function GET(request: NextRequest) {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => {
        try { controller.enqueue(encoder.encode(data)); } catch { clients.delete(send); }
      };
      clients.add(send);
      request.signal.addEventListener('abort', () => clients.delete(send));
    },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
