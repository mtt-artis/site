import { type JSX, splitProps } from "solid-js";
import { useI18n } from "~/contexts/i18n";

export const NoData = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  const { t } = useI18n();
  const [local, rest] = splitProps(props, ["children"]);
  return (
    <div {...rest} role="alert">
      <div class="flex grow flex-wrap md:mt-4 md:flex-col">
        <strong class="font-semibold md:text-xl text-base-700">{t("noDataFound")}</strong>
        <span class="text-xs empty:hidden">{local.children}</span>
      </div>
    </div>
  );
};
