const cacheMap = new Map<string, Intl.NumberFormat>();

export const formatNumber = (
  number: string | number | undefined | null,
  local = "fr",
  option?: { fractionDigits: number },
) => {
  const key = option ? JSON.stringify({ local, option }) : local;
  let formator = cacheMap.get(key);
  if (!formator) {
    formator = new Intl.NumberFormat(local, {
      maximumFractionDigits: option?.fractionDigits,
      minimumFractionDigits: option?.fractionDigits,
    });
    cacheMap.set(key, formator);
  }

  if (typeof number === "number") {
    return formator.format(number);
  }
  if (typeof number === "string") {
    const num = Number(number);
    return Number.isFinite(num) ? formator.format(num) : "";
  }
  return "";
};

export const formatCurrency = (number: string | number | undefined | null, local: string) => {
  const key = `${local}CURRENCY`;
  let formator = cacheMap.get(key);
  if (!formator) {
    formator = new Intl.NumberFormat(local, {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
    cacheMap.set(key, formator);
  }
  if (typeof number === "number") {
    return formator.format(number);
  }
  if (typeof number === "string") {
    const num = Number(number);
    return Number.isFinite(num) ? formator.format(num) : "";
  }
  return "";
};

export const formatNumberFactory =
  (fractionDigits: number) =>
  (number: string | number | undefined | null, local = "fr") =>
    formatNumber(number, local, { fractionDigits });
