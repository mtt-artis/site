import {
  createContext,
  createSignal,
  createUniqueId,
  type JSX,
  type ParentProps,
  Show,
  splitProps,
  useContext,
} from "solid-js";

export const Popover = (props: Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> & { childrenAlwaysMount?: boolean }) => {
  const popover = usePopover();
  const [local, rest] = splitProps(props, ["children", "onToggle"]);
  const [isOpen, setIsOpen] = createSignal(false);

  return (
    <div
      id={popover.popoverId}
      popover="auto"
      onToggle={(e) => {
        setIsOpen(e.newState === "open");
        if (typeof local.onToggle === "function") {
          local.onToggle(e);
        } else if (Array.isArray(local.onToggle)) {
          const [handler, data] = local.onToggle;
          handler(data, e);
        }
      }}
      {...rest}
      ref={(el) => {
        typeof props.ref === "function" ? props.ref(el) : props.ref = el;
        if (popover.anchored) {
          Object.assign(el.style, {
            positionAnchor: `--${popover.popoverId}`,
            viewTransitionName: `--${popover.popoverId}`,
          });
        }
      }}
    >
      <Show when={isOpen() || props.childrenAlwaysMount}>{local.children}</Show>
    </div>
  );
};

export const Trigger = (props: JSX.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const popover = usePopover();
  return (
    <button
      type="button"
      popovertarget={popover.popoverId}
      commandfor={popover.popoverId}
      command="toggle-popover"
      aria-label="toggle popover"
      {...props}
      ref={(el) => {
        typeof props.ref === "function" ? props.ref(el) : props.ref = el;
        if (popover.anchored) {
          Object.assign(el.style, {
            anchorName: `--${popover.popoverId}`,
          });
        }
      }}
    />
  );
};

const PopoverContext = createContext<{ popoverId: string, anchored: boolean } | null>(null);

export const PopoverProvider = (props: ParentProps<{ anchored?: true }>) => {
  return (
    <PopoverContext.Provider
      value={{
        popoverId: createUniqueId(),
        anchored: props.anchored ?? false,
      }}
    >
      {props.children}
    </PopoverContext.Provider>
  );
};

export const usePopover = () => {
  const context = useContext(PopoverContext);
  if (context == null) {
    throw new Error("usePopover() must be used within a <Popover.Root />");
  }
  return context;
};

export default {
  Root: PopoverProvider,
  Popover,
  Trigger,
};
