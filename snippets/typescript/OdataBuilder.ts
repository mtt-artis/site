
import type { StandardSchemaV1 } from "@standard-schema/spec";

async function standardValidate<T extends StandardSchemaV1>(
  schema: T,
  input: StandardSchemaV1.InferInput<T>
): Promise<StandardSchemaV1.InferOutput<T>> {
  let result = schema["~standard"].validate(input);
  if (result instanceof Promise) result = await result;

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2));  
  }

  return result.value;
}

const isEmpty = (obj: object) => {
  for (const _ in obj) return false;
  return true;
};

type OdataValueType = string | number | boolean | null | undefined | Date;
type IsValidOdataItem<T> = T extends Record<string, OdataValueType> ? T : never;
type InferArrayTypeIfArray<T> = T extends (infer U)[] ? U : T;
type FilterString = string & { _tag: "ODataFilterString" };

const escapeOdataString = (s: string) => s.replace(/'/g, "''");
const sanitizeValue = (s: string | number | boolean) => {
  if (typeof s === "string") return `'${escapeOdataString(s)}'`;
  return escapeOdataString(String(s));
};
const sanitizeKey = (s: string) => s.toString().replace(/[^A-Za-z_]/g, "_");

export class OdataBuilder<T extends StandardSchemaV1, O extends IsValidOdataItem<InferArrayTypeIfArray<StandardSchemaV1.InferOutput<T>>>> {
  readonly #url: string;
  readonly #fetch: (url: string) => Promise<StandardSchemaV1.InferOutput<T>>;
  #filters: Array<FilterString> = [];
  #skip?: number;
  #limit?: number;
  #schema: T;

  constructor(props: { url: string; fetch: (url: string) => any; schema: T }) {
    this.#url = props.url;
    this.#fetch = props.fetch;
    this.#schema = props.schema;
  }

  // skip and limit setters for pagination
  skip(n: number) {
    this.#skip = Math.max(0, Math.floor(n));
    return this;
  }

  limit(n: number) {
    this.#limit = Math.max(0, Math.floor(n));
    return this;
  }

  async fetch(): Promise<StandardSchemaV1.InferOutput<T>> {
    const filters = this.#filters.length === 1 ? this.#filters[0] : (this.#filters.join(" and ") as FilterString);

    const parts = [`$format=json`];
    if (filters) parts.push(`$filter=${filters}`);
    if (typeof this.#skip === "number") parts.push(`$skip=${this.#skip}`);
    if (typeof this.#limit === "number") parts.push(`$top=${this.#limit}`);

    const url = `${this.#url}?${parts.join("&")}`;

    const data = await this.#fetch(url);

    const validated = await standardValidate(this.#schema, data);
    return validated;
  }

  filter(
    f: (eb: {
      and: (props: Partial<O> | Array<FilterString>) => FilterString;
      or: (props: Partial<O> | Array<FilterString>) => FilterString;
      exp: (key: keyof O & string, op: "eq" | "ne" | "lt" | "le" | "gt" | "ge", v: OdataValueType) => FilterString;
    }) => FilterString,
  ) {
    const exp = (key: keyof O & string, op: "eq" | "ne" | "lt" | "le" | "gt" | "ge", v: OdataValueType) => {
      if (v == null) return "" as FilterString;
      if (v instanceof Date) return `${sanitizeKey(key)} ${op} datetime'${v.toISOString()}'` as FilterString;
      const t = typeof v;
      if (t === "number" || t === "boolean") return `${sanitizeKey(key)} ${op} ${sanitizeValue(v as any)}` as FilterString;
      return `${sanitizeKey(key)} ${op} ${sanitizeValue(String(v))}` as FilterString;
    };

    const op = (op: " and " | " or ") => (props: Partial<O> | Array<FilterString>) => {
      if (Array.isArray(props)) {
        const l = props.length;
        if (l === 0) return "" as FilterString;
        if (l === 1) return props[0] ?? ("" as FilterString);
        return `(${props.join(op)})` as FilterString;
      }
      if (isEmpty(props)) return "" as FilterString;
      return `(${Object.entries(props)
        .map(([k, v]) => exp(k, "eq", v as any))
        .filter(Boolean)
        .join(op)})` as FilterString;
    };

    const eb = {
      and: op(" and "),
      or: op(" or "),
      exp,
    };

    const filter = f(eb);
    if (filter) this.#filters.push(filter);

    return this;
  }
}
