let sessions = new Map();
let lastCleanup = Date.now();

export default function handler(req, res) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.socket.remoteAddress ||
    "unknown";

  const now = Date.now();
  sessions.set(ip, now);

  // Clean inactive users every 60s
  if (now - lastCleanup > 60000) {
    for (let [key, value] of sessions) {
      if (now - value > 60000) sessions.delete(key);
    }
    lastCleanup = now;
  }

  const viewers = sessions.size;
  res.status(200).json({ viewers });
}
