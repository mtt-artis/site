import { For } from "solid-js";
import Dialog from "~/components/base/Dialog";
import { DialogHeader } from "~/components/base/DialogHeader";
import { LabeledText } from "~/components/base/LabeledText";
import { useI18n } from "~/contexts/i18n";
import { formatDateTime } from "~/utils/formatDate";

export const DrawerInfo = <T extends object>(props: { data: T; title: string; label?: string }) => {
  const { t } = useI18n();
  return (
    <Dialog.Root>
      <Dialog.Trigger class="ui-link">{props.label ?? props.title}</Dialog.Trigger>
      <Dialog.Dialog class="ui-drawer ui-card flex flex-col" closeOnClickBackdrop={true}>
        <DialogHeader title={props.title} />
        <div class="p-4 grid gap-2">
          <For each={Object.entries(props.data)}>
            {([k, v]) => (
              <LabeledText
                label={t(k as "TRUST_ME") || k}
                text={
                  v instanceof Date ? (
                    formatDateTime(v, "fr")
                  ) : typeof v === "object" && v != null ? (
                    <pre class="p-1 bg-base-100 w-full">{JSON.stringify(v, null, 2)}</pre>
                  ) : (
                    v
                  )
                }
              />
            )}
          </For>
        </div>
      </Dialog.Dialog>
    </Dialog.Root>
  );
};
