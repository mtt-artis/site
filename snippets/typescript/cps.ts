/**
 * Continuation Passing Style (CPS) utility.
 *
 * CPS is a programming style where, instead of returning results directly,
 * functions receive an additional "continuation" argument — a function that
 * represents the next step in the computation. Rather than returning values,
 * the function calls its continuation.
 *
 * This helper, `runCPS`, allows you to write CPS-style recursive functions
 * without worrying about stack overflows by effectively turning recursion
 * into iteration.
 *
 * @example
 * ```ts
 * // Example: Factorial implemented using CPS
 * const factorialCPS = runCPS((n: number, acc: number = 1, stop = (x) => x) => {
 *   if (n <= 1) return stop(acc);
 *   return () => factorialCPS(n - 1, n * acc, stop);
 * });
 *
 * console.log(factorialCPS(1_000)); // Large factorial computed safely without stack overflow
 * ```
 */
export const runCPS = <I, A, T>(
  fn: (input: I, acc: A, stop: (x: T) => T) => unknown,
): ((input: I, ...rest: unknown[]) => T) => {
  return function cps(...args) {
    // @ts-expect-error
    let result = fn.apply(this, args);
    while (typeof result === "function") result = result();
    return result as T;
  };
};
