import { useParams as originalUseParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import { type ErrorMessage, type ObjectEntries, type ObjectIssue, type ObjectSchema, parse } from "valibot";

export const useParams = <
  TEntries extends ObjectEntries,
  TMessage extends ErrorMessage<ObjectIssue>,
  T extends ObjectSchema<TEntries, TMessage | undefined>,
>(
  schema: T,
) => {
  const _params = originalUseParams();
  const params = createMemo(() => {
    const tmp = {} as Record<string, string>;
    for (const key of Object.keys(schema.entries)) {
      if (typeof _params[key] === "string") tmp[key] = decodeURIComponent(_params[key]);
    }
    return parse(schema, tmp);
  });
  return params;
};
