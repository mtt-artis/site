import type { ParentProps } from "solid-js";

export const CardGradient = (props: ParentProps) => {
  return (
    <div class="ui-card hover:shadow group relative flex transition-shadow outline-2px outline-outline -outline-offset-1 hover:outline focus-visible:outline  group-focus-visible:outline h-full w-full">
      <div class="absolute inset-0 from-primary-20 to-primary-40 bg-gradient-to-r opacity-0 transition duration-300 group-hover:opacity-50 group-focus-visible:opacity-50 [mask-image:radial-gradient(180px_at_95%_12%,white,transparent)]" />
      {props.children}
    </div>
  );
};
