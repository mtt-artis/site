import type { JSX } from "solid-js";
import { CardGradient } from "./CardGradient";
import { Link } from "./Link";

interface BaseProps {
  href: string;
  title: JSX.Element;
  description?: JSX.Element;
  class?: string;
}

interface IconProps extends BaseProps {
  icon?: JSX.Element;
  image?: never;
}

interface ImageProps extends BaseProps {
  image?: JSX.Element;
  icon?: never;
}

export const LinkCard = (props: IconProps | ImageProps) => (
  <Link href={props.href} class={props.class || "decoration-none group"}>
    <CardGradient>
      <div class="absolute bottom-2 right-2 [mask-image:linear-gradient(white,transparent)]">
        {props.icon}
      </div>
      <div class="relative px-4 pb-4 pt-16">
        <div class="text-neutral-900 mt-4 text-[0.875rem] font-semibold leading-7">{props.title}</div>
        <p class="text-neutral-600 mt-1 text-[0.875rem] leading-[1.5rem]">{props.description}</p>
      </div>
    </CardGradient>
  </Link>
);
