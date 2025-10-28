import {
  date,
  nonEmpty,
  picklist,
  pipe,
  type RawTransformAction,
  rawTransform,
  type SchemaWithPipe,
  type StringSchema,
  string,
  transform,
} from "valibot";

export function stringToNumber<T>(options: {
  emptyAs: T;
}): SchemaWithPipe<[StringSchema<undefined>, RawTransformAction<string, number | T>]>;
export function stringToNumber(): SchemaWithPipe<
  [StringSchema<undefined>, RawTransformAction<string, number>]
>;
export function stringToNumber(options?: { emptyAs?: unknown }) {
  return pipe(
    string(),
    rawTransform(({ dataset, addIssue, NEVER }) => {
      if (dataset.value === "" && options && "emptyAs" in options) return options.emptyAs;
      const n = Number(dataset.value);
      if (Number.isNaN(n)) {
        addIssue({
          message: `${dataset.value} must be a number`,
        });
        return NEVER;
      }
      if (!Number.isFinite(n)) {
        addIssue({
          message: `${dataset.value} must be a finite number`,
        });
        return NEVER;
      }
      return n;
    }),
  );
}

export function stringToBoolean() {
  return pipe(
    picklist(["true", "false"]),
    transform((val) => val === "true"),
  );
}

export function stringToDate(format?: "YYYYMMDD" | "DD/MM/YYYY") {
  return pipe(
    string(),
    nonEmpty(),
    transform((value) => {
      if (format === "DD/MM/YYYY") {
        const day = value.slice(0, 2);
        const month = value.slice(3, 5);
        const year = value.slice(6, 10);
        return new Date(`${year}-${month}-${day}`);
      } else if (format === "YYYYMMDD") {
        const year = value.slice(0, 4);
        const month = value.slice(4, 6);
        const day = value.slice(6, 8);
        return new Date(`${year}-${month}-${day}`);
      }
      return new Date(value);
    }),
    date(),
  );
}

