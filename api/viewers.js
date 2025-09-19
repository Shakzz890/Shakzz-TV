import { Redis } from '@upstash/redis';

// Connect to your Redis database using Vercel's environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "unknown";

    const sessionKey = `viewer:${ip}`;
    const now = Date.now();

    // Use a Redis "set" command with an expiration time
    // This atomically sets the key and a time-to-live (TTL).
    // The 'NX' option means "only if the key does not exist".
    // This is useful to avoid unnecessary writes, though not strictly required.
    // The 'EX' option sets the expiration time in seconds.
    // We'll set it to 60s, so the session is active for 1 minute.
    await redis.set(sessionKey, now, { ex: 60 });

    // Get all session keys that match "viewer:*"
    const viewerKeys = await redis.keys("viewer:*");

    // The number of viewers is the count of active keys
    const viewers = viewerKeys.length;
    
    // Send the correct data format
    res.status(200).json({ count: viewers });
  } catch (error) {
    console.error("Error updating viewer count:", error);
    res.status(500).json({ error: "Failed to update viewer count" });
  }
}
