import { Redis } from '@upstash/redis/cloudflare'

export async function onRequest(context) {
  const { env, request } = context;
  
  // CORS Headers allow your site to talk to this API
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const redis = Redis.fromEnv(env);
    const url = new URL(request.url);
    
    // Get the User ID from the browser
    const userId = url.searchParams.get('uid') || 'anonymous';
    const now = Date.now();
    
    // CLEANUP RULE: Delete anyone who hasn't pinged in 10 seconds
    const timeoutLimit = now - 10000; 

    // 1. Register this user as "Online" right now
    await redis.zadd('online_users', { score: now, member: userId });

    // 2. Remove old users
    await redis.zremrangebyscore('online_users', 0, timeoutLimit);

    // 3. Count who is left
    const activeCount = await redis.zcard('online_users');

    return new Response(JSON.stringify({ count: activeCount }), { headers: corsHeaders });

  } catch (err) {
    // If it crashes, tell the frontend WHY
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}
