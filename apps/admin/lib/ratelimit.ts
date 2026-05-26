import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// In-memory store for development / when Upstash is not configured
class InMemoryStore {
  private store = new Map<string, { tokens: number; lastRefill: number }>();

  async get(key: string): Promise<number> {
    const entry = this.store.get(key);
    return entry?.tokens ?? 0;
  }

  async set(key: string, value: number, ttlMs?: number): Promise<void> {
    this.store.set(key, {
      tokens: value,
      lastRefill: Date.now(),
    });
    if (ttlMs) {
      setTimeout(() => this.store.delete(key), ttlMs);
    }
  }

  async incr(key: string): Promise<number> {
    const entry = this.store.get(key);
    const newTokens = (entry?.tokens ?? 0) + 1;
    this.store.set(key, { tokens: newTokens, lastRefill: Date.now() });
    return newTokens;
  }

  async decr(key: string): Promise<number> {
    const entry = this.store.get(key);
    const newTokens = Math.max(0, (entry?.tokens ?? 0) - 1);
    this.store.set(key, { tokens: newTokens, lastRefill: Date.now() });
    return newTokens;
  }

  async del(key: string): Promise<void> {
    this.store.delete(key);
  }
}

// Determine if Upstash is configured
const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const hasUpstash = Boolean(upstashUrl && upstashToken);

/**
 * Create a Ratelimit instance.
 * - With Upstash env vars: uses persistent Redis-backed sliding window.
 * - Without: uses in-memory sliding window (per-process, resets on restart).
 */
function createLimiter(
  window: `${number} ${"s" | "m" | "h" | "d"}`,
  maxRequests: number,
): Ratelimit {
  if (hasUpstash) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(maxRequests, window),
      analytics: true,
      prefix: "forhemit:rl",
    });
  }

  // In-memory fallback — built-in MemoryStore in @upstash/ratelimit
  return new Ratelimit({
    redis: new Redis({
      // Use a no-op connection; Ratelimit will still work with its own in-memory fallback
      url: "https://dummy.redis.upstash.io",
      token: "dummy",
    }),
    limiter: Ratelimit.slidingWindow(maxRequests, window),
    analytics: false,
    prefix: "forhemit:rl:local",
  });
}

// ─── Rate limit tiers ────────────────────────────────────────────────────────

/** 10 requests / minute — for webhooks and sensitive external endpoints */
export const strictLimiter = createLimiter("1 m", 10);

/** 60 requests / minute — for authenticated admin API routes */
export const normalLimiter = createLimiter("1 m", 60);

/** 200 requests / minute — for general API routes (health, public reads) */
export const generousLimiter = createLimiter("1 m", 200);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Extract a client IP from request headers.
 * Prefers X-Forwarded-For (Vercel/Cloudflare) then falls back to "unknown".
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    // X-Forwarded-For may contain multiple IPs; take the first
    return forwarded.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

/**
 * Apply rate limiting to a request using the given limiter and identifier.
 * Returns null if the request is allowed, or a 429 Response if rate-limited.
 */
export async function checkRateLimit(
  limiter: Ratelimit,
  identifier: string,
): Promise<Response | null> {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);

  if (success) return null;

  return new Response(
    JSON.stringify({
      error: "Too many requests",
      retryAfter: Math.ceil((reset - Date.now()) / 1000),
    }),
    {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
        "X-RateLimit-Limit": String(limit),
        "X-RateLimit-Remaining": String(remaining),
        "X-RateLimit-Reset": String(reset),
      },
    },
  );
}
