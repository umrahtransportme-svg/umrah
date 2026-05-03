// Simple in-memory rate limiter — works for single-instance and development.
// For multi-instance production (Vercel), add @upstash/ratelimit + Redis.

interface Window {
  count: number
  resetAt: number
}

const store = new Map<string, Window>()

// Purge expired entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now()
  for (const [key, win] of store) {
    if (win.resetAt < now) store.delete(key)
  }
}, 5 * 60_000)

/**
 * Returns true if the request is allowed, false if rate-limited.
 * @param key      Unique identifier (e.g. IP + route)
 * @param max      Max requests per window (default 5)
 * @param windowMs Window duration in ms (default 60 s)
 */
export function checkRateLimit(key: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now()
  const win = store.get(key)

  if (!win || win.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (win.count >= max) return false
  win.count++
  return true
}
