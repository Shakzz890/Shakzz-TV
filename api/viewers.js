import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

export default async function handler(req, context) {
  // --- UNIVERSAL ENV CHECK ---
  // Vercel uses 'process.env'. Cloudflare passes env in the 2nd argument (context).
  // We check if 'process' exists to avoid crashing on Cloudflare.
  const env = (typeof process !== 'undefined' && process.env) ? process.env : context;

  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Device ID is required." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    await redis.set(sessionKey, now, { ex: 60 });
    const viewerKeys = await redis.keys("viewer:*");
    const viewers = viewerKeys.length;
    
    return new Response(JSON.stringify({ count: viewers }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update viewer count" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
