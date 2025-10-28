import { Show } from "solid-js";
import { useI18n } from "~/contexts/i18n";

export const Pagination = (props: { page: number; hasNext: boolean; setPage: (page: number) => void }) => {
  const { t } = useI18n();
  return (
    <Show when={!(props.page === 0 && !props.hasNext)}>
      <div class="grid gap-2 grid-cols-2">
        <button
          type="button"
          class="ui-btn w-full capitalize"
          disabled={props.page <= 0}
          onClick={() => {
            props.setPage(props.page - 1);
          }}
        >
          {t("prev")}
        </button>
        <button
          type="button"
          class="ui-btn w-full capitalize"
          disabled={!props.hasNext}
          onClick={() => {
            props.setPage(props.page + 1);
          }}
        >
          {t("next")}
        </button>
      </div>
    </Show>
  );
};
