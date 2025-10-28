import { useAuth } from "@solid-mediakit/auth/client";
import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import Dropdown from "~/components/base/Dropdown";
import { Icon } from "~/components/base/Icon";
import { LabeledText } from "~/components/base/LabeledText";
import { useI18n } from "~/contexts/i18n";

export const Header = () => {
  const auth = useAuth();
  const { t } = useI18n();
  return (
    <header class="z-2 bg-contrast grid w-full items-center text-white shadow-lg xl:fixed h-[3.25rem]">
      <ul class="flex md:gap-6 row-span-full col-span-full">
        <li class="flex">
          <a href="/">
            <img alt="logo" class="-translate-y-2px h-8 shrink-0 px-2" src="/logo.svg" />
          </a>
          <div class="hidden md:flex gap-2">
            <div class="w-5 h-8 -skew-x-20 bg-primary" />
            <div class="w-5 h-8 -skew-x-20 bg-primary-80" />
          </div>
        </li>
      </ul>
      <button
        type="button"
        popovertarget="nav"
        popovertargetaction="toggle"
        class="mis-auto mie-2 ui-btn ui-contrast md:hidden row-span-full col-span-full"
      >
        <svg
          role="img"
          aria-label="menu icon"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <span class="sr-only">Toggle menu</span>
      </button>
      <nav popover="auto" id="nav" class="relative ui-drawer md:contents ui-card md:bg-contrast">
        <button
          type="button"
          popovertarget="nav"
          popovertargetaction="toggle"
          class="mis-auto mie-2 mbs-2 ui-btn ui-ghost md:hidden"
        >
          <Icon name="CrossFilledIcon" class="h-3 w-3" />
        </button>
        <ul class="mx-auto flex flex-col p-4 gap-4 md:flex-row md:row-span-full md:col-span-full md:p-0">
          <Show when={auth.status() === "authenticated"}>
            <li>
              <A
                href="/todo"
                end={false}
                class="ui-btn ui-contrast aria-[current=page]:bg-base-600 uppercase"
              >
                TODO
              </A>
            </li>
            <li>
              <button
                type="button"
                class="ui-btn ui-contrast uppercase md:hidden"
                onClick={() => auth.signOut({ redirectTo: "/?manually=true" })}
              >
                {t("logout")}
              </button>
            </li>
          </Show>
        </ul>
        <Show when={auth.status() === "authenticated"}>
          <Dropdown.Root>
            <Dropdown.Trigger class="ui-btn ui-contrast text-base-300 absolute right-2 hidden md:block">
              <Icon name="UserIcon" class="h-4 w-4" />
            </Dropdown.Trigger>
            <Dropdown.Popover class="ui-dropdown ui-dropdown-rtl">
              <div class="grid gap-2 p-2">
                {auth.session()?.user?.sub || "unknown"}

                <LabeledText label="roles:">
                  <ul class="text-xs">
                    <For each={auth.session()?.user?.roles}>{(r) => <li>{r}</li>}</For>
                  </ul>
                </LabeledText>

                <button
                  type="button"
                  class="ui-btn w-full capitalize"
                  onClick={() => auth.signOut({ redirectTo: "/?manually=true" })}
                >
                  {t("logout")}
                </button>
              </div>
            </Dropdown.Popover>
          </Dropdown.Root>
        </Show>
      </nav>
    </header>
  );
};
