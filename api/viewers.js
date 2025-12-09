import { Redis } from '@upstash/redis';

export const config = {
  runtime: 'edge',
};

// This is the universal handler
export default async function handler(req, ctx) {
  // -------------------------------------------------------------
  // 1. SAFE ENVIRONMENT CHECK (The Fix)
  // -------------------------------------------------------------
  let redisUrl, redisToken;

  if (typeof process !== 'undefined' && process.env) {
    // We are on Vercel
    redisUrl = process.env.UPSTASH_REDIS_REST_URL;
    redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  } else if (ctx && ctx.UPSTASH_REDIS_REST_URL) {
    // We are on Cloudflare (ctx is the 'env' object here)
    redisUrl = ctx.UPSTASH_REDIS_REST_URL;
    redisToken = ctx.UPSTASH_REDIS_REST_TOKEN;
  }

  // Debugging: If this logs "Missing", we know the vars aren't set in the dashboard
  if (!redisUrl || !redisToken) {
    console.error("CRITICAL: Redis Credentials not found.");
    return new Response(JSON.stringify({ error: "Server Configuration Error" }), { status: 500 });
  }

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  // -------------------------------------------------------------
  // 2. STANDARD LOGIC
  // -------------------------------------------------------------
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
        'Access-Control-Allow-Origin': '*', // Added CORS for safety
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
