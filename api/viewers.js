import { Redis } from '@upstash/redis/cloudflare';

export default {
  async fetch(request, env) {
    const redis = Redis.fromEnv(env);
    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get('deviceId');

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400 });
    }

    // Use deviceId to count 1 per device
    const sessionKey = `viewer:${deviceId}`;
    
    // Set expiry to 60s (if they don't ping within 60s, they are 'offline')
    await redis.set(sessionKey, "active", { ex: 60 });
    
    // Efficiently count keys (SCAN is better than KEYS for production)
    const { keys } = await redis.scan(0, { match: 'viewer:*', count: 1000 });
    
   return new Response(JSON.stringify({ count: keys.length }), {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*' 
    },
  });
} 
}; 