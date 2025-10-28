export const query = (s: string, e = document) => e.querySelector(s);
export const queryAll = (s: string, e = document) => e.querySelectorAll(s);
export const on = (
  e: Element | Document,
  event: keyof GlobalEventHandlersEventMap,
  fn: (e: Event) => unknown,
) => {
  e.addEventListener(event, fn);
  return () => e.removeEventListener(event, fn);
};
