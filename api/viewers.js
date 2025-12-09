import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { deviceId } = req.query;

    if (!deviceId) {
      res.status(400).json({ error: "Device ID is required." });
      return;
    }

    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    await redis.set(sessionKey, now, { ex: 60 });

    const viewerKeys = await redis.keys("viewer:*");

    const viewers = viewerKeys.length;
    
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({ count: viewers });
  } catch (error) {
    console.error("Error updating viewer count:", error);
    res.status(500).json({ error: "Failed to update viewer count" });
  }
}
