export interface WithRetryArguments<K> {
  retries?: number;
  delayBetweenRetries?: number;
  onFail?: (error: Error, args: K) => Promise<void> | void;
  onTryError?: (error: Error, args: K, attemptIndex: number) => Promise<void> | void;
}

export const withRetry = <K extends unknown[], T>(
  fn: (...args: K) => Promise<T>,
  opts: WithRetryArguments<K> = {},
) => {
  const { retries = 3, delayBetweenRetries = 0, onFail, onTryError } = opts || {};
  const retFn = async (...args: K) => {
    let attemptIndex = 0;

    while (attemptIndex < retries) {
      try {
        const ret = await fn(...args);

        return ret as T;
      } catch (err) {
        if (attemptIndex < retries) {
          try {
            await onTryError?.(err as Error, args, attemptIndex);
          } catch (error) {
            await onFail?.(error as Error, args);
            throw error;
          }
        }
        attemptIndex += 1;
        if (attemptIndex >= retries) {
          await onFail?.(err as Error, args);
          throw err;
        }

        if (delayBetweenRetries > 0) {
          await new Promise((resolve) => setTimeout(resolve, delayBetweenRetries));
        }
      }
    }
  };

  return retFn as (...args: K) => Promise<T>;
};
