import { type JSX, splitProps } from "solid-js";

type Props = JSX.HTMLAttributes<HTMLLabelElement> & {
  label: JSX.Element;
  children: JSX.Element;
  required?: boolean;
};

export const LabeledInput = (props: Props) => {
  const [local, others] = splitProps(props, ["required", "label", "children"]);
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: input is in props.children
    <label {...others}>
      <div
        class={
          local.required
            ? "text-base-700 whitespace-nowrap text-xs first-letter:capitalize after:content-['_*'] after:text-red"
            : "text-base-700 whitespace-nowrap text-xs first-letter:capitalize"
        }
      >
        {local.label}
      </div>
      {local.children}
    </label>
  );
};
