import { Redis } from "@upstash/redis/cloudflare";

export async function onRequest(context) {
  const { env, request } = context;

  // 1. Initialize Redis using the Environment Variables
  // (Do not hardcode keys here for security!)
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    // 2. Get the Device ID from the URL
    const url = new URL(request.url);
    const deviceId = url.searchParams.get("deviceId");

    if (!deviceId) {
      return new Response(JSON.stringify({ error: "Device ID required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 3. Active Viewer Logic
    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();

    // Mark this device as active for 60 seconds
    await redis.set(sessionKey, now, { ex: 60 });

    // Count how many active keys exist (Using `SCAN` instead of `KEYS` is more production-friendly)
    let cursor = 0;
    let count = 0;
    do {
      const result = await redis.scan(cursor, {
        match: "viewer:*",
        count: 100,  // You can adjust this based on your expected number of keys
      });
      cursor = result.cursor;
      count += result.keys.length;
    } while (cursor !== "0");

    // 4. Return the result
    return new Response(JSON.stringify({ count }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Redis Error:", error);
    return new Response(JSON.stringify({ error: "Failed to update" }), {
      status: 500,
    });
  }
}
