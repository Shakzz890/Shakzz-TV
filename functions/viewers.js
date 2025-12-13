import { Redis } from "@upstash/redis/cloudflare";

export async function onRequest(context) {
  const { env, request } = context;

  // Initialize Redis using the Environment Variables from Cloudflare Pages
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    // Get the deviceId from the URL query parameters
    const url = new URL(request.url);
    const deviceId = url.searchParams.get("deviceId");

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Device ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Active Viewer Logic: Set device as active in Redis for 60 seconds
    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    // Mark this device as active for 60 seconds
    await redis.set(sessionKey, now, { ex: 60 });

    // Count how many active keys exist (using `SCAN` instead of `KEYS` is more production-friendly)
    let cursor = 0;
    let count = 0;
    do {
      const result = await redis.scan(cursor, {
        match: "viewer:*",
        count: 100,  // You can adjust this based on expected key counts
      });
      cursor = result.cursor;
      count += result.keys.length;
    } while (cursor !== "0");

    // Return the viewer count
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*",  // Enable cross-origin requests
      },
    });
  } catch (error) {
    console.error("Redis Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update" }), {
      status: 500,
    });
  }
}
