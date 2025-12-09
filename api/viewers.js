import { Redis } from '@upstash/redis';

// Config for Vercel to run this on Edge (Cloudflare-like environment)
export const config = {
  runtime: 'edge',
};

export default async function handler(req, ctx) {
  // 1. Handle Environment Variables (Universal Fix)
  // Vercel uses process.env. Cloudflare uses 'ctx' (or 'env' as 2nd arg).
  // We try to grab the keys from wherever they are available.
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL || (ctx && ctx.UPSTASH_REDIS_REST_URL);
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || (ctx && ctx.UPSTASH_REDIS_REST_TOKEN);

  const redis = new Redis({
    url: redisUrl,
    token: redisToken,
  });

  try {
    // 2. Parse URL (Standard Web API)
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

    // 3. Update Redis
    await redis.set(sessionKey, now, { ex: 60 });
    const viewerKeys = await redis.keys("viewer:*");
    const viewers = viewerKeys.length;
    
    // 4. Return Response (Standard Web API)
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
    console.error("Error updating viewer count:", error);
    return new Response(JSON.stringify({ error: "Failed to update viewer count" }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
