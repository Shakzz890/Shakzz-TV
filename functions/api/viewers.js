import { Redis } from '@upstash/redis';

// ✅ CORRECT: Must be named 'onRequest' for Cloudflare Pages
export async function onRequest(context) {
  const { env, request } = context;

  // 1. Safe Variable Check
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return new Response(JSON.stringify({ error: "Server Error: Missing API Keys" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // 2. Initialize Redis
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    const url = new URL(request.url);
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Device ID is required." }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    // 3. Redis Logic
    await redis.set(sessionKey, now, { ex: 60 });
    const viewerKeys = await redis.keys("viewer:*");
    
    return new Response(JSON.stringify({ count: viewerKeys.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    // This logs the actual error to your Cloudflare Dashboard > Logs
    console.error("Worker Error:", error);
    return new Response(JSON.stringify({ error: "Worker failed to execute" }), { status: 500 });
  }
}
