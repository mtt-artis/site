export type BetterTypeof<T> = T extends number
  ? "number" | "integer" | "NaN" // Allow all possible number types
  : T extends string
  ? "string"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends null
  ? "null"
  : T extends unknown[]
  ? "array"
  : T extends Date
  ? "Date"
  : T extends Set<unknown>
  ? "Set"
  : T extends Map<unknown, unknown>
  ? "Map"
  : T extends BigInt
  ? "bigInt"
  : T extends object
  ? "object"
  : "unknown";

export const type0f = <T>(data: T): BetterTypeof<T> => {
  const t = typeof data;
  if (t === "number") {
    if (Number.isNaN(data)) return "NaN" as BetterTypeof<T>;
    if (Number.isInteger(data)) return "integer" as BetterTypeof<T>;
    return "number" as BetterTypeof<T>;
  }

  if (t === "object") {
    if (Array.isArray(data)) return "array" as BetterTypeof<T>;
    if (data === null) return "null" as BetterTypeof<T>;
    if (
      data &&
      Object.getPrototypeOf(data) !== Object.prototype &&
      data.constructor
    ) {
      return data.constructor.name as BetterTypeof<T>; // "Date",  "Set", etc
    }
    return "object" as BetterTypeof<T>;
  }
  return t as BetterTypeof<T>;
};
