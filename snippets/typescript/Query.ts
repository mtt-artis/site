interface FilterFn<T> {
  (e: T): boolean;
}

const and = <T>(...specs: FilterFn<T>[]) => (e: T) => specs.every((s) => s(e));
const or = <T>(...specs: FilterFn<T>[]) => (e: T) => specs.some((s) => s(e));
const not = <T>(fn: FilterFn<T>) => (e: T) => !fn(e);
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

const stringFilter = <T, K extends keyof T>(
  key: K,
  value: string,
  method: "includes" | "startsWith" | "endsWith",
  caseSensitive = false
) => {
  const valueLower = caseSensitive ? value : value.toLowerCase();
  return (e: T) => {
    const v = e[key];
    if (typeof v !== "string") return false;
    if (caseSensitive) return v[method](value);
    return v.toLowerCase()[method](valueLower);
  };
};

const includes = <T, K extends keyof T>(key: K, value: string, caseSensitive = false) =>
  stringFilter<T,K>(key, value, "includes", caseSensitive);

const startsWith = <T, K extends keyof T>(key: K, value: string, caseSensitive = false) =>
  stringFilter<T,K>(key, value, "startsWith", caseSensitive);

const endsWith = <T, K extends keyof T>(key: K, value: string, caseSensitive = false) =>
  stringFilter<T,K>(key, value, "endsWith", caseSensitive);

type Transformers<T> = Partial<Record<keyof T, (value: T[keyof T]) => string | number | Date>>;

/**
 * A fluent query builder for filtering, sorting, and paginating arrays of objects.
 * Supports chaining operations like where, orderBy, and page for building complex queries.
 *
 * @example
 * ```typescript
 * const items = [
 *   { name: "apple", price: 50, stock: 10 },
 *   { name: "banana", price: 20, stock: 0 },
 *   { name: "apricot", price: 120, stock: 5 },
 * ];
 *
 * const { includes, lt } = Query.filterFn;
 * const result = Query.from(items)
 *   .where(includes("name", "a"))
 *   .where(lt("price", 100))
 *   .orderBy("name", "asc")
 *   .page(0, 2)
 *   .execute();
 * // Filters items with name containing "a" and price < 100, sorts by name ascending, takes first page of 2 items.
 * ```
 */
export class Query<T> {
  private constructor(
    private readonly items: T[],
    private readonly specs: FilterFn<T>[] = [],
    private readonly sortOptions?: { sortBy: keyof T; sortDir?: "asc" | "desc" },
    private readonly transformers?: Transformers<T>,
    private readonly pageNumber?: number,
    private readonly pageSize?: number,
  ) { }

  static compare<T>(a: T, b: T, key: keyof T, transformers?: Transformers<T>): number {
    let aVal = a[key];
    let bVal = b[key];
    const t = transformers?.[key];
    if (t) {
      // @ts-expect-error
      aVal = t(aVal);
      // @ts-expect-error
      bVal = t(bVal);
    }

    if (aVal == null) return bVal == null ? 0 : -1;
    if (bVal == null) return 1;

    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.toLowerCase().localeCompare(bVal.toLowerCase());
    }
    if (typeof aVal === "number" && typeof bVal === "number") {
      return aVal - bVal;
    }
    if (typeof aVal === "boolean" && typeof bVal === "boolean") {
      return (aVal === bVal ? 0 : aVal ? 1 : -1);
    }
    if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() - bVal.getTime();
    }
    return 0;
  }

  static filterFn = Object.freeze({
    includes,
    startsWith,
    endsWith,
    lt,
    lte,
    gt,
    gte,
    eq,
    neq,
    isTruthy,
    isFalsy,
    and,
    or,
    not,
  });

  /**
   * Creates a new Query instance from an array of items.
   * @param items The array of objects to query.
   * @returns A new Query instance.
   */
  static from<T>(items: T[]): Query<T> {
    return new Query(items);
  }

  /**
   * Adds a filter specification to the query.
   * @param spec A function that returns true for items to include.
   * @returns A new Query instance with the filter applied.
   */
  where(spec: FilterFn<T>): Query<T> {
    return new Query(this.items, [...this.specs, spec], this.sortOptions, this.transformers, this.pageNumber, this.pageSize);
  }

  /**
   * Sets the sorting criteria for the query.
   * @param key The property key to sort by.
   * @param direction The sort direction, defaults to ascending.
   * @param transformers Optional transformers for sorting values.
   * @returns A new Query instance with sorting applied.
   */
  orderBy<K extends keyof T>(
    key: K,
    direction?: "asc" | "desc",
    transformers?: Transformers<T>,
  ): Query<T> {
    return new Query(this.items, this.specs, { sortBy: key, sortDir: direction }, transformers, this.pageNumber, this.pageSize);
  }

  /**
   * Sets pagination for the query results.
   * @param pageNumber The page number (1-based).
   * @param pageSize The number of items per page.
   * @returns A new Query instance with pagination applied.
   */
  page(pageNumber: number, pageSize: number): Query<T> {
    return new Query(this.items, this.specs, this.sortOptions, this.transformers, pageNumber, pageSize);
  }

  /**
   * Executes the query and returns the filtered, sorted, and paginated results.
   * @returns The array of items matching the query criteria.
   */
  execute(): T[] {
    let result = this.specs.length === 0 ? [...this.items] : this.items.filter(and(...this.specs));

    if (this.sortOptions) {
      const { sortBy, sortDir } = this.sortOptions;
      const multiplier = sortDir === "asc" ? 1 : -1;
      result = result.sort((a, b) => multiplier * Query.compare(a, b, sortBy, this.transformers));
    }

    if (this.pageNumber !== undefined && this.pageSize !== undefined) {
      const start = this.pageNumber * this.pageSize;
      const end = start + this.pageSize;
      result = result.slice(start, end);
    }

    return result;
  }
}
