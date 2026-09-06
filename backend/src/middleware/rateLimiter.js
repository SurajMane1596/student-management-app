import rateLimit from "express-rate-limit";

// Slows down brute-force login attempts without punishing normal use.
// Keyed by IP by default; behind a proxy/load balancer, make sure
// `app.set("trust proxy", ...)` is configured (see app.js) so this reads
// the real client IP rather than the proxy's.
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many attempts. Please try again later." },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "Too many requests. Please slow down." },
});
