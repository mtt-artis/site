import { type JSXElement, Show } from "solid-js";
import { type Roles, useHasRoles } from "~/utils/roles";

type Props = {
  roles: Roles;
  fallback?: JSXElement;
  children: JSXElement;
};

export const GuardRole = (props: Props) => {
  return (
    <Show when={useHasRoles(props.roles)} fallback={props.fallback}>
      {props.children}
    </Show>
  );
};
