import { useSearchParams as originalUseSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import { type ErrorMessage, type ObjectEntries, type ObjectIssue, type ObjectSchema, parse } from "valibot";

export const useSearchParams = <
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<ObjectIssue>,
  T extends ObjectSchema<TEntries, TMessage | undefined>,
>(
  schema: T,
) => {
  const [_search, setSearch] = originalUseSearchParams();
  const search = createMemo(() => {
    const tmp = {} as Partial<Record<string, string | string[]>>;
    for (const key of Object.keys(schema.entries)) {
      if (typeof _search[key] === "string") tmp[key] = decodeURIComponent(_search[key]);
    }
    return parse(schema, tmp);
  });
  return [search, setSearch] as const;
};
