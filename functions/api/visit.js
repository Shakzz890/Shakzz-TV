import { Redis } from '@upstash/redis/cloudflare'

export async function onRequest(context) {
  const { env } = context;

  // Initialize Redis
  const redis = Redis.fromEnv(env);

  // Increment a counter called 'shakzz_tv_views'
  const newCount = await redis.incr('shakzz_tv_views');

  return new Response(JSON.stringify({ 
    count: newCount 
  }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' // Allows your frontend to read this
    }
  });
}
