import { type JSX, splitProps } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLDivElement> & {
  label: JSX.Element;
  text?: JSX.Element | JSX.Element[];
  children?: JSX.Element;
};

// TO REMEMBER: do not do this
// <Show when={<RenderComponent />}>
//   <RenderComponent />
// </Show>
// https://github.com/solidjs/solid/issues/1977#issuecomment-1863124628

export const LabeledText = (props: Props) => {
  const [local, others] = splitProps(props, ["label", "text", "children"]);
  return (
    <div {...others}>
      {typeof local.label === "string" ? (
        <div class="text-base-700 whitespace-nowrap text-xs first-letter:capitalize min-h-[1lh]">
          {local.label}
        </div>
      ) : (
        local.label
      )}
      {local.children || (
        <span class="text-base-800 flex gap-x-1 text-sm font-semibold min-h-[1lh] text-wrap">
          {local.text || "-"}
        </span>
      )}
    </div>
  );
};
