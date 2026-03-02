import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const limiters = new Map<string, Ratelimit>();

function getLimiter(maxAttempts: number): Ratelimit {
  const key = `${maxAttempts}`;
  let limiter = limiters.get(key);
  if (!limiter) {
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(maxAttempts, '15 m'),
      analytics: false,
      prefix: 'ratelimit',
    });
    limiters.set(key, limiter);
  }
  return limiter;
}

export async function checkRateLimit(
  key: string,
  maxAttempts: number = 5
): Promise<{ allowed: boolean; retryAfterSeconds?: number }> {
  try {
    const limiter = getLimiter(maxAttempts);
    const { success, reset } = await limiter.limit(key);

    if (!success) {
      const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
      return { allowed: false, retryAfterSeconds };
    }

    return { allowed: true };
  } catch (error) {
    // If Redis is unavailable, allow the request (don't block real users)
    console.error('Rate limit check failed:', error instanceof Error ? error.message : 'Unknown error');
    return { allowed: true };
  }
}
