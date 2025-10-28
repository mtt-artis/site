// Revert Partial<T>
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

export type Merge<T, U> = keyof T & keyof U extends never
  ? T & U
  : Omit<T, keyof T & keyof U> & U;

type InferArrayType<T> = T extends (infer U)[] ? U : never;
