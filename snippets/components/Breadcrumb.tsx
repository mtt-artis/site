import { A } from "@solidjs/router";
import { For, type JSXElement } from "solid-js";
import { Icon } from "./Icon";

export const Breadcrumb = (props: { class?: string; children: Array<JSXElement> }) => {
  return (
    <header class={props.class || "flex gap-2"}>
      <nav aria-label="breadcrumb">
        <ol>
          <li>
            <A href="/">
              <Icon name="HomeIcon" class="-mbs-1 mie-2" />
            </A>
          </li>
          <For each={props.children}>{(i) => <li>{i}</li>}</For>
        </ol>
      </nav>
    </header>
  );
};
