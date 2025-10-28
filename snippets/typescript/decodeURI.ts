export function decodeURIString(val: string): string | undefined;
export function decodeURIString(val: string | undefined, fallback: string): string;
export function decodeURIString(val: string | undefined, fallback?: string | undefined): string | undefined;
export function decodeURIString(val: string | undefined, fallback?: string | undefined) {
  if (!val) return fallback;
  const souldDecode = val.indexOf("%") >= 0;
  return souldDecode ? decodeURIComponent(val) : val;
}

export const decodeURIOrThrow = (val: string | undefined) => {
  if (!val) throw new Error("decodeURIOrThrow");
  return decodeURIComponent(val);
};
