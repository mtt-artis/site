import type { JSX } from "solid-js";

export const Tag = (
  props: Omit<JSX.HTMLAttributes<HTMLSpanElement>, "class"> & {
    color?: "primary" | "yellow" | "orange" | "red" | "purple" | "green" | "transparent";
  },
) => {
  return (
    <span
      {...props}
      data-c={props.color}
      class="text-xs inline-flex items-center gap-2 font-semibold uppercase px-2 py-0.25 rounded w-fit bg-base-200 text-base-700 data-[c=primary]:bg-primary data-[c=primary]:text-base-50 data-[c=yellow]:bg-yellow-200 data-[c=yellow]:text-yellow-700 data-[c=red]:bg-red-200 data-[c=red]:text-red-700 data-[c=purple]:bg-purple-200 data-[c=purple]:text-purple-700 data-[c=green]:bg-green-200 data-[c=green]:text-green-700 data-[c=orange]:bg-orange-200 data-[c=orange]:text-orange-700 data-[c=transparent]:bg-transparent data-[c=transparent]:text-transparent"
    >
      {props.children}
    </span>
  );
};
