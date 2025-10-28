/**
 * A tagged template that produces a ReadableStream of its content.
 * It supports interpolating other ReadableStreams, which allows you
 * to easily wrap streams with text or combine multiple streams, etc.
 *
 * @example
 * const wrappedBody = stream`<template>${response.body}</template>`;
 * const combinedStream = stream`${stream1}${stream2}`;
 */
export function stream(
  strings: TemplateStringsArray,
  ...values: Array<string | Promise<string> | ReadableStream>
) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    async start(controller) {
      try {
        for (let i = 0; i < strings.length; i++) {
          if (strings[i]) {
            controller.enqueue(encoder.encode(strings[i]));
          }

          if (i < values.length) {
            const value = values[i];

            if (value instanceof ReadableStream) {
              const reader = value.getReader();

              while (true) {
                const { done, value: chunk } = await reader.read();
                if (done) break;
                controller.enqueue(chunk);
              }
            } else {
              const v = value instanceof Promise ? await value : value;
              if (v) controller.enqueue(encoder.encode(v));
            }
          }
        }
      } catch (error) {
        controller.error(error);
      }
      controller.close();
    },
  });
}


export async function* yieldLinesFromStream(stream: ReadableStream) {
  const decoder = new TextDecoder();
  let buffer = "";
  // @ts-expect-error
  for await (const chunk of  stream) {
    buffer += decoder.decode(chunk, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || ""; // Keep the last incomplete line

    for (const line of lines) {
      yield line.trim();
    }
  }

  if (buffer) {
    yield buffer.trim();
  }
}
