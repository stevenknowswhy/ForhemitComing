/**
 * Hard deadline wrapper for blog data fetching.
 *
 * Convex's `fetchQuery`/`client.query` can hang indefinitely when the backend
 * is unreachable (no error, just a pending promise). Every blog data path
 * wraps its query in `withTimeout` so a stalled backend always converts into
 * a catchable rejection and the UI can fall back to its error state.
 */
export class BlogQueryTimeoutError extends Error {
  readonly timeoutMs: number;

  constructor(timeoutMs: number) {
    super(`Blog data query timed out after ${timeoutMs}ms`);
    this.name = "BlogQueryTimeoutError";
    this.timeoutMs = timeoutMs;
  }
}

export function withTimeout<T>(promise: Promise<T>, timeoutMs: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new BlogQueryTimeoutError(timeoutMs)),
      timeoutMs
    );
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}
