export const inlineWorker = (source: string): Worker => {
  const blob = new Blob([source], {
    type: "text/javascript",
  });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
};
