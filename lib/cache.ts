const DAY_MS = 24 * 60 * 60 * 1000;
const comparisonCache = new Map<string, { expiry: number; value: any }>();
const ipDailyCounter = new Map<string, { count: number; resetAt: number }>();

export const buildCacheKey = (a: string, b: string, region: string) =>
  `${a.trim().toLowerCase()}|${b.trim().toLowerCase()}|${region.trim().toLowerCase()}`;

export function getCachedComparison(key: string) {
  const hit = comparisonCache.get(key);
  if (!hit) return null;
  if (hit.expiry < Date.now()) {
    comparisonCache.delete(key);
    return null;
  }
  return hit.value;
}

export function setCachedComparison(key: string, value: any) {
  comparisonCache.set(key, { expiry: Date.now() + DAY_MS, value });
}

export function enforceDailyLimit(ip: string) {
  const now = Date.now();
  const current = ipDailyCounter.get(ip);
  if (!current || current.resetAt < now) {
    ipDailyCounter.set(ip, { count: 1, resetAt: now + DAY_MS });
    return { allowed: true, remaining: 4 };
  }
  if (current.count >= 5) return { allowed: false, remaining: 0 };
  current.count += 1;
  return { allowed: true, remaining: 5 - current.count };
}
