/**
 * 300ms by default
 */
export const debounce = <T extends unknown[]>(fn: (...args: T) => void, ms = 300) => {
  let timer: NodeJS.Timeout;

  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, ms);
  };
};
