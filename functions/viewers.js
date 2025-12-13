import { Redis } from '@upstash/redis/cloudflare';

export async function onRequest(context) {
  // 1. Connect to Redis using Cloudflare's context
  const redis = Redis.fromEnv(context.env);

  // 2. Get the device ID from the URL (optional, based on your cutie.js)
  const url = new URL(context.request.url);
  const deviceId = url.searchParams.get("deviceId");

  // OPTION A: Simple Global Counter (Increases every time)
  const count = await redis.incr("shakzz_views");

  // 4. Return the result to cutie.js
  return new Response(JSON.stringify({ count: count }), {
    headers: { 
      'Content-Type': 'application/json' 
    }
  });
}
