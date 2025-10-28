interface Spec<T> {
  (e: T): boolean;
}

const and = <T>(...specs: Spec<T>[]) => (e: T) => specs.every((s) => s(e));
const or = <T>(...specs: Spec<T>[]) => (e: T) => specs.some((s) => s(e));
const not = <T>(spec: Spec<T>) => (e: T) => !spec(e);
const isTruthy = <T>(key: keyof T) => (e: T) => Boolean(e[key]);
const isFalsy = <T>(key: keyof T) => not(isTruthy(key));

const compareValues = <T, K extends keyof T>(
  key: K,
  value: T[K],
  comparator: (a: T[K], b: T[K]) => boolean,
) => (e: T) => comparator(e[key], value);

const lt = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a < b);
const lte = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a <= b);
const gt = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a > b);
const gte = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a >= b);
const eq = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a === b);
const neq = <T, K extends keyof T>(key: K, value: T[K]) => compareValues(key, value, (a, b) => a !== b);

export { and, or, not, isTruthy, isFalsy, lt, lte, gt, gte, eq, neq };
