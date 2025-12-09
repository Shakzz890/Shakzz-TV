import { Redis } from '@upstash/redis';

// Cloudflare Pages specific entry point
export async function onRequest(context) {
  const { env, request } = context;

  // 1. Check if keys are loaded
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing API Keys" }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

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

    await redis.set(sessionKey, now, { ex: 60 });
    const viewerKeys = await redis.keys("viewer:*");
    
    // 2. Standard Response for Cloudflare
    return new Response(JSON.stringify({ count: viewerKeys.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to update" }), { status: 500 });
  }
}
