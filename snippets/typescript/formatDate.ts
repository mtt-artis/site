const cacheMap = new Map<string, Intl.DateTimeFormat>();

export const formatDate = (date: string | number | undefined | null | Date, local: string) => {
  let formator = cacheMap.get(local);
  if (!formator) {
    formator = new Intl.DateTimeFormat(local, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    cacheMap.set(local, formator);
  }
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (d.toString() === "Invalid Date") return "";
  return formator.format(d);
};

export const formatDateTime = (date: string | number | undefined | null | Date, local: string) => {
  const key = `${local}time`;
  let formator = cacheMap.get(key);
  if (!formator) {
    formator = new Intl.DateTimeFormat(local, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    cacheMap.set(key, formator);
  }
  if (!date) return "";
  const d = date instanceof Date ? date : new Date(date);
  if (d.toString() === "Invalid Date") return "";
  return formator.format(d);
};
