import { type Accessor, For, type JSX, type JSXElement, splitProps } from "solid-js";

interface Props<T extends Record<string, unknown>> extends JSX.HTMLAttributes<HTMLTableElement> {
  headers: Array<
    | keyof T
    | {
        key: keyof T | (string & {});
        header?: JSXElement;
        thAttributes?:
          | JSX.HTMLAttributes<HTMLTableCellElement>
          | ((ctx: { colIndex: Accessor<number> }) => JSX.HTMLAttributes<HTMLTableCellElement>);
        tdAttributes?:
          | JSX.HTMLAttributes<HTMLTableCellElement>
          | ((ctx: {
              row: T;
              key: keyof T;
              rowIndex: Accessor<number>;
              colIndex: Accessor<number>;
            }) => JSX.HTMLAttributes<HTMLTableCellElement>);
        cell?: (ctx: {
          row: T;
          key: keyof T;
          rowIndex: Accessor<number>;
          colIndex: Accessor<number>;
        }) => JSXElement;
      }
  >;
  data: Array<T>;
  trAttributes?:
    | JSX.HTMLAttributes<HTMLTableRowElement>
    | ((ctx: { row: T; rowIndex: Accessor<number> }) => JSX.HTMLAttributes<HTMLTableRowElement>);
}
export const Table = <T extends Record<string, unknown>>(props: Props<T>) => {
  const [local, others] = splitProps(props, ["headers", "data", "class", "trAttributes"]);
  const _headers = local.headers.map((header) =>
    typeof header === "object"
      ? header
      : {
          key: header,
          header,
          cell: undefined,
          thAttributes: undefined,
          tdAttributes: undefined,
          trAttributes: undefined,
        },
  );
  return (
    <figure class={local.class}>
      <table class="ui-table" {...others}>
        <thead>
          <tr>
            <For each={_headers}>
              {(h, colIndex) => (
                <th
                  scope="col"
                  class="resize-x overflow-auto"
                  {...(typeof h.thAttributes === "function" ? h.thAttributes({ colIndex }) : h.thAttributes)}
                >
                  {(h.header || h.key) as string}
                </th>
              )}
            </For>
          </tr>
        </thead>
        <tbody>
          <For each={props.data}>
            {(row, rowIndex) => (
              <tr
                {...(typeof local.trAttributes === "function"
                  ? local.trAttributes({ row, rowIndex })
                  : local.trAttributes)}
              >
                <For each={_headers}>
                  {(col, colIndex) => (
                    <td
                      {...(typeof col.tdAttributes === "function"
                        ? col.tdAttributes({
                            row,
                            key: col.key,
                            rowIndex,
                            colIndex,
                          })
                        : col.tdAttributes)}
                    >
                      {col.cell?.({
                        row,
                        key: col.key,
                        rowIndex,
                        colIndex,
                      }) || (row[col.key] as JSXElement)}
                    </td>
                  )}
                </For>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </figure>
  );
};
