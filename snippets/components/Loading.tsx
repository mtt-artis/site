import { type JSX, splitProps } from "solid-js";
import { Icon } from "~/components/base/Icon";

type Props = JSX.HTMLAttributes<HTMLDivElement> & { text?: string };

export const Loading = (props: Props) => {
  const [local, rest] = splitProps(props, ["text"]);
  return (
    <div {...rest}>
      <style>
        {`
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes loader {
  0% { gap: 30rem; margin-left: -100%; transform: translateX(-100%); }
  45%, 55% { gap: 0; margin-left: 50%; transform: translateX(-50%); }
  100% { gap: 30rem; margin-left: 150%; transform: translateX(0); }
}

@keyframes icon {
  0% { opacity: 0; }
  45%, 55% { opacity: 1; }
  100% { opacity: 0; }
}
`}
      </style>
      <div class="grid animate-[fadeIn_1s_ease-in-out_forwards] gap-4 opacity-0 delay-500">
        <span class="text-center text-xl font-bold capitalize">{local.text}</span>

        <div class="relative overflow-hidden">
          <div class="relative ml-0 flex w-fit -translate-x-2/4 animate-[loader_infinite_3s_ease-in-out] items-center justify-evenly gap-0">
            <Icon
              name="Dot"
              class="rotate-90 animate-[icon_infinite_3s_ease-in-out] w-20 h-20"
            />
            <Icon
              name="Dot"
              class="rotate-90 animate-[icon_infinite_3s_ease-in-out] w-20 h-20"
            />
            <Icon
              name="Dot"
              class="rotate-90 animate-[icon_infinite_3s_ease-in-out] w-20 h-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
