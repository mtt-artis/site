import { A } from "@solidjs/router";
import type { JSXElement } from "solid-js";
import { useI18n } from "~/contexts/i18n";

export const ErrorComponent = (props: { code?: string; description?: JSXElement; trace?: JSXElement }) => {
  const { t } = useI18n();
  return (
    <div class="container relative mx-auto h-full w-full items-center gap-4" role="alert">
      <div class="flex grow flex-wrap gap-2 md:flex-col">
        <strong class="font-bold md:text-2xl">Well, this is embarrassing...</strong>
        <span class="font-bold md:text-xl">
          {props.description || "Sorry, this is not working properly."}
        </span>
        {props.code && (
          <span class="md:mt-2">
            <strong class="font-bold">{props.code}</strong>.
          </span>
        )}
        <div class="flex gap-2">
          <div class="flex gap-2">
            <a
              href={window.location.toString()}
              onClick={() => {
                window.location = location as string & Location;
              }}
              class="ui-btn capitalize"
            >
              {t("retry")}
            </a>
            <A href=".." class="ui-btn ui-primary capitalize">
              {t("back")}
            </A>
          </div>
        </div>
      </div>
    </div>
  );
};
