import { Redis } from '@upstash/redis/cloudflare'

export async function onRequest(context) {
  const { env, request } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const redis = Redis.fromEnv(env);
    const url = new URL(request.url);
    
    const userId = url.searchParams.get('uid') || 'anonymous';
    const now = Date.now();
    const timeoutLimit = now - 10000; 

    // 🔥 OPTIMIZATION: Use a Pipeline to reduce latency
    const pipeline = redis.pipeline();
    
    // 1. Add/Update the user
    pipeline.zadd('online_users', { score: now, member: userId });
    
    // 2. Remove old users
    pipeline.zremrangebyscore('online_users', 0, timeoutLimit);
    
    // 3. Count remaining
    pipeline.zcard('online_users');
    
    // Execute all three commands at once
    const results = await pipeline.exec();
    
    // results[2] is the output of the zcard command
    const activeCount = results[2];

    return new Response(JSON.stringify({ count: activeCount }), { headers: corsHeaders });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}