import { Redis } from '@upstash/redis';

// Vercel Config (Cloudflare ignores this)
export const config = {
  runtime: 'edge',
};

export default async function handler(context) {
  // 1. Handle Differences between Vercel and Cloudflare
  // On Vercel, the request is the first arg. On Cloudflare, it's inside the context object.
  // We normalize this so it works everywhere.
  
  const req = context instanceof Request ? context : context.request; 
  
  // 2. Get Environment Variables Safely
  // Vercel uses process.env. Cloudflare uses context.env.
  const env = (typeof process !== 'undefined' && process.env) 
    ? process.env 
    : (context.env || context);

  // 3. Check for API Keys
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    console.error("Missing Redis Credentials");
    return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500 });
  }

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
