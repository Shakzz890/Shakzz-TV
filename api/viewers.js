import { Redis } from '@upstash/redis';

// Force the function to use Edge Runtime
export const config = {
  runtime: 'edge',
};

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req) {
  // Edge functions use standard Web Request objects, not (req, res)
  const { searchParams } = new URL(req.url);
  const deviceId = searchParams.get('deviceId');

  if (!deviceId) {
    return new Response(JSON.stringify({ error: "Missing deviceId" }), { status: 400 });
  }

  const sessionKey = `viewer:${deviceId}`;
  await redis.set(sessionKey, Date.now(), { ex: 60 });
  const keys = await redis.keys('viewer:*');
  
  return new Response(JSON.stringify({ count: keys.length }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
