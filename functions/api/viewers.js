import { Redis } from '@upstash/redis';

// Cloudflare Pages Functions are named `onRequest` and receive a `context` object.
export async function onRequest(context) {
  // Environment variables are accessed via `context.env`
  const { env } = context;

  // Initialize the Redis client inside the function using the context
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    // Query parameters are parsed from the request URL
    const url = new URL(context.request.url);
    const deviceId = url.searchParams.get('deviceId');

    if (!deviceId) {
      // Instead of res.status().json(), you return a new `Response` object.
      // The body must be a string, so we use JSON.stringify().
      const errorResponse = { error: "Device ID is required." };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // --- Your core logic (this part is unchanged) ---
    const sessionKey = `viewer:${deviceId}`;
    const now = Date.now();
    await redis.set(sessionKey, now, { ex: 60 }); // Set with 60-second expiry
    const viewerKeys = await redis.keys("viewer:*");
    const viewers = viewerKeys.length;
    // ------------------------------------------------

    // Create a headers object for the successful response
    const headers = {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };
    
    // Return a successful `Response` object with the viewer count
    const successResponse = { count: viewers };
    return new Response(JSON.stringify(successResponse), {
      status: 200,
      headers: headers,
    });

  } catch (error) {
    // Log the actual error to the Cloudflare dashboard for debugging
    console.error("Error in viewer count function:", error);

    // Return a generic 500 error response
    const errorResponse = { error: "Failed to update viewer count" };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}