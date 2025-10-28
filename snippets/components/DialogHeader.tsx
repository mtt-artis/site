import { Show } from "solid-js";
import Dialog from "~/components/base/Dialog";
import { Icon } from "~/components/base/Icon";
import { useI18n } from "~/contexts/i18n";
import { formatDateTime } from "~/utils/formatDate";

export const DialogHeader = (props: {
  title: string | number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt?: Date | string | null;
  updatedAt?: Date | string | null;
  onClose?: () => void;
}) => {
  const { t } = useI18n();

  return (
    <header class="p-4 text-4xl font-semibold sticky top-0 z-999 bg-white">
      <Dialog.CloseButton type="button" class="ui-btn ui-ghost mis-auto" onClick={props.onClose}>
        <Icon name="CrossFilledIcon" class="text-gray-600 size-3" />
      </Dialog.CloseButton>
      <div class="first-letter:capitalize">{props.title}</div>
      <div class="empty:hidden normal-case font-normal text-xs text-base-800 mt-1">
        <Show when={props.createdBy}>
          {`${t("createdAt")} ${formatDateTime(props.createdAt, "fr")} ${t("createdBy")} ${props.createdBy}`.toLowerCase()}
          <Show when={props.updatedBy && props.createdAt?.toString() !== props.updatedAt?.toString()}>
            <br />
            {`${t("updatedAt")} ${formatDateTime(props.updatedAt, "fr")} ${t("updatedBy")} ${props.updatedBy}`.toLowerCase()}
          </Show>
        </Show>
      </div>
    </header>
  );
};
