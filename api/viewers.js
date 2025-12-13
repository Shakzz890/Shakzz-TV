import { Redis } from '@upstash/redis';

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  // 1. Safety Check: Verify Env Vars are actually loaded
  if (!process.env.UPSTASH_REDIS_REST_URL) {
    console.error("Missing UPSTASH_REDIS_REST_URL. Did you redeploy?");
    return res.status(500).json({ error: "Server Configuration Error: Missing DB Credentials" });
  }

  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      return res.status(400).json({ error: "Device ID is required." });
    }

    const sessionKey = `viewer:${deviceId}`;
    
    // 2. Update Redis
    // 'ex: 60' sets the key to expire in 60 seconds (heartbeat)
    await redis.set(sessionKey, Date.now(), { ex: 60 });

    // 3. Get Count
    // Note: Using keys() is okay for small apps, but dbsize() or a counter is faster for large ones.
    const viewerKeys = await redis.keys("viewer:*");
    const viewers = viewerKeys.length;
    
    // 4. Set Headers to prevent browser caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    
    return res.status(200).json({ count: viewers });

  } catch (error) {
    console.error("Redis Error:", error);
    return res.status(500).json({ error: "Failed to update viewer count", details: error.message });
  }
}
