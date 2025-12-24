import { Redis } from '@upstash/redis/cloudflare'

export async function onRequest(context) {
  const { env, request } = context;
  const redis = Redis.fromEnv(env);

  const url = new URL(request.url);
  const userId = url.searchParams.get('uid') || 'anonymous';
  
  const now = Date.now();
  
  // *** CONFIGURATION ***
  // Delete users who haven't pinged in 10 seconds
  const timeoutLimit = now - 10000; 

  try {
    // 1. Update this user's "Last Seen" time
    await redis.zadd('online_users', { score: now, member: userId });

    // 2. Remove anyone older than 10 seconds
    await redis.zremrangebyscore('online_users', 0, timeoutLimit);

    // 3. Count who is left
    const activeCount = await redis.zcard('online_users');

    return new Response(JSON.stringify({ count: activeCount }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
