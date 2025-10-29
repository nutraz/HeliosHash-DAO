export interface RetryConfig {
  maxAttempts: number;
  backoffMs: number;
  backoffMultiplier?: number;
  maxBackoffMs?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export async function retry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    backoffMs = 1000,
    backoffMultiplier = 2,
    maxBackoffMs = 10000,
    onRetry,
  } = config;

  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      const delay = Math.min(backoffMs * Math.pow(backoffMultiplier, attempt - 1), maxBackoffMs);

      onRetry?.(attempt, lastError);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
