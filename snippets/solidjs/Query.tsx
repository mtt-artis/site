import { type JSXElement, Match, Switch } from "solid-js";
import { ErrorComponent } from "~/components/base/Error";
import { formatJsonString } from "~/utils/solidstart/formatJsonString";
import { isServerFnBodyError, type ServerFnBodyError } from "~/utils/solidstart/isServerFnBodyError";

const getError = <T extends unknown | ServerFnBodyError>(maybeErrorFn: () => T) => {
  const maybeError = maybeErrorFn();
  return isServerFnBodyError(maybeError) ? maybeError : null;
};

const getValue = <T extends unknown | ServerFnBodyError>(maybeErrorFn: () => T) => {
  const maybeError = maybeErrorFn();
  if (maybeError === undefined) return;
  if (isServerFnBodyError(maybeError)) throw new Error("should not be an Error");
  return maybeError as Exclude<T, ServerFnBodyError | undefined>;
};

export const Query = <T extends unknown | ServerFnBodyError>(props: {
  signal: () => T;
  children: (query: () => Exclude<T, ServerFnBodyError | undefined>) => JSXElement;
}) => {
  return (
    <Switch>
      <Match when={getError(props.signal)}>
        {(error) => (
          <ErrorComponent
            description={
              <pre class="empty:hidden ui-card grid p-2 text-wrap bg-red-100 border-red-200 text-red-800">
                {formatJsonString(error().message)}
              </pre>
            }
          />
        )}
      </Match>
      <Match when={getValue(props.signal)}>{(data) => props.children(data)}</Match>
    </Switch>
  );
};
