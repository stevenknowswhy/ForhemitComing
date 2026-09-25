/**
 * Reject if the wrapped promise does not settle within `timeoutMs`.
 *
 * The Convex client queues mutations and retries connections indefinitely
 * during outages, so a submit promise can stay pending forever. This bounds
 * the wait so the UI can surface a recovery action instead of a dead spinner.
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), timeoutMs);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error: unknown) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
