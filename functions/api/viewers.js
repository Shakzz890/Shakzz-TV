import { Redis } from '@upstash/redis';

// CLOUDFLARE PAGES REQUIREMENT:
// You must use "onRequest", not "export default"
export async function onRequest(context) {
  const { env, request } = context;

  // 1. Safety Check for Keys
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing API Keys on Cloudflare" }), { 
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
      return new Response(JSON.stringify({ error: "Device ID is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    // 2. Update Redis
    await redis.set(sessionKey, now, { ex: 60 });
    const viewerKeys = await redis.keys("viewer:*");
    
    // 3. Return Response
    return new Response(JSON.stringify({ count: viewerKeys.length }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Access-Control-Allow-Origin': '*', // Allows your frontend to talk to it
      },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Redis Error" }), { status: 500 });
  }
}
