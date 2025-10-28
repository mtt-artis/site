export const compareString = (a: string, b: string) => a.localeCompare(b);

export const compareDate = (a?: Date | null, b?: Date | null) => {
  const dateA = a?.getTime() ?? -Infinity;
  const dateB = b?.getTime() ?? -Infinity;
  return dateA - dateB;
};
