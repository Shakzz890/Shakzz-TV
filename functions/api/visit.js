import { Redis } from '@upstash/redis/cloudflare'

export async function onRequest(context) {
  try {
    const { env } = context;

    // CHECK: Are the secrets actually there?
    if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
      throw new Error("Missing Upstash API Keys in Cloudflare Settings!");
    }

    // Initialize Redis
    const redis = Redis.fromEnv(env);

    // Count the visit
    const newCount = await redis.incr('shakzz_tv_views');

    return new Response(JSON.stringify({ 
      success: true, 
      count: newCount 
    }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    // If it fails, PRINT the error so we can read it
    return new Response(JSON.stringify({
      error: err.message,
      stack: err.stack
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
