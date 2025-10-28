import { type JSX, splitProps } from "solid-js";

export const Icon = (
  props: {
    name:
      | "AlarmIcon"
      | "AlignCenterIcon"
      | "AlignJustifyIcon"
      | "AlignLeftIcon"
      | "AlignRightIcon"
      | "AnchorIcon"
      | "ArrowDownIcon"
      | "ArrowUpIcon"
      | "BackwardIcon"
      | "BarChartFilledIcon"
      | "BarChartIcon"
      | "BellFilledIcon"
      | "BellIcon"
      | "..."
      | "WarningIcon"
      | "WaterDropIcon"
      | "ZoomInIcon"
      | "ZoomOutIcon";
  } & JSX.SvgSVGAttributes<SVGSVGElement>,
) => {
  const [local, others] = splitProps(props, ["name"]);
  return (
    <svg
      aria-label={local.name}
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      {...others}
    >
      <use href={`/spritemap.svg#${local.name}`} />
    </svg>
  );
};
