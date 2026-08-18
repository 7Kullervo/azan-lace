// ============================================================
// Simple in-memory rate limiter for auth endpoints (login/signup).
// ------------------------------------------------------------
// Good enough to blunt casual brute-force attempts on a single
// server instance. If you deploy across multiple server instances
// or serverless functions, this resets per-instance — for real
// production-grade protection at scale, put a proper rate limiter
// in front (e.g. Upstash Redis, Vercel's Edge Config, or a WAF
// rule at your hosting provider).
// ============================================================

const attempts = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (entry.count >= limit) return false;

  entry.count += 1;
  return true;
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}
