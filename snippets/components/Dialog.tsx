import {
  type Accessor,
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  type JSX,
  type ParentProps,
  type Setter,
  Show,
  type Signal,
  splitProps,
  useContext,
} from "solid-js";

type Props = Omit<JSX.DialogHtmlAttributes<HTMLDialogElement>, "id"> & {
  childrenAlwaysMount?: boolean;
};

export const Dialog = (props: Props) => {
  const dialog = useDialog();
  const [local, rest] = splitProps(props, ["children", "childrenAlwaysMount", "ref"]);
  let ref: HTMLDialogElement
  createEffect(() => {
    const isOpen = dialog.isOpen();
    if (isOpen === ref.open) return;
    if (isOpen) {
      ref.showModal();
    } else {
      ref.close();
    }
  });
  return (
    <dialog
      id={dialog.dialogId}
      ref={el => {
        ref = el;
        typeof local.ref === "function" ? local.ref(el) : local.ref = el;
        const observer = new MutationObserver(() => dialog.setIsOpen(el.open));
        observer.observe(el, { attributes: true, attributeFilter: ["open"] });
      }}
      {...rest}
    >
      <Show when={dialog.isOpen() || props.childrenAlwaysMount}>
        {local.children}
      </Show>
    </dialog>
  );
};

export const CloseButton = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dialog = useDialog();
  return (
    <button
      type={props.type || "button"}
      commandfor={dialog.dialogId}
      command="close"
      aria-label="close dialog"
      {...props}
    />
  );
};

export const Trigger = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const dialog = useDialog();
  return (
    <button
      type={props.type || "button"}
      commandfor={dialog.dialogId}
      command="show-modal"
      aria-label="open dialog"
      {...props}
    />
  );
};

const DialogContext = createContext<{
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  level: number;
  dialogId: string;
} | null>(null);

export const DialogProvider = (props: ParentProps<{ signal?: Signal<boolean> }>) => {
  const context = useContext(DialogContext);
  const [isOpen, setIsOpen] = props.signal || createSignal(false);

  return (
    <DialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        level: (context?.level ?? 0) + 1,
        dialogId: createUniqueId(),
      }}
    >
      {props.children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context == null) {
    throw new Error("useDialog() must be used within a <Dialog.Root />");
  }
  return context;
};

export default {
  Root: DialogProvider,
  Dialog,
  CloseButton,
  Trigger,
};
