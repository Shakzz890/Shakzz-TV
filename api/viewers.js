import { Redis } from '@upstash/redis';

// Connect to your Redis database using Vercel's environment variables.
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Get the device ID from the query parameter.
    const { deviceId } = req.query;

    if (!deviceId) {
      // If no device ID is provided, respond with an error.
      res.status(400).json({ error: "Device ID is required." });
      return;
    }

    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    // Use a Redis "set" command with an expiration time.
    // This now tracks each unique device ID.
    await redis.set(sessionKey, now, { ex: 60 });

    // Get all session keys that match "viewer:*".
    const viewerKeys = await redis.keys("viewer:*");

    // The number of viewers is the count of active keys (unique devices).
    const viewers = viewerKeys.length;
    
    // Add these headers to disable caching, which fixes the 304 issue.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    // Send the correct data format to the frontend.
    res.status(200).json({ count: viewers });
  } catch (error) {
    console.error("Error updating viewer count:", error);
    res.status(500).json({ error: "Failed to update viewer count" });
  }
}
