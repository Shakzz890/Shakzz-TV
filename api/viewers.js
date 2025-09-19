// This is the complete, final api/viewers.js file

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

    // Use a Redis "set" command with an expiration time of 60 seconds.
    // Each request from the user resets this timer.
    await redis.set(sessionKey, now, { ex: 60 });

    // Get all session keys that match "viewer:*".
    // This correctly counts the number of active sessions.
    const viewerKeys = await redis.keys("viewer:*");

    const viewers = viewerKeys.length;
    
    // Add these headers to disable caching.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.status(200).json({ count: viewers });
  } catch (error) {
    console.error("Error updating viewer count:", error);
    res.status(500).json({ error: "Failed to update viewer count" });
  }
}
