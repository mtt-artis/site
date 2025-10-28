import { A, type AnchorProps, useLocation } from "@solidjs/router";
import { untrack } from "solid-js/web";

export const Link = (props: AnchorProps) => {
  const location = useLocation();
  return <A state={{ previous: location.pathname }} {...props} />;
};

export const BackLink = (props: Omit<AnchorProps, "href">) => {
  const location = useLocation();
  // @ts-expect-error
  const backPath = () => (location.state?.previous as string) || "";
  return <Link state={{ previous: location.pathname }} href={untrack(() => backPath())} {...props} />;
};
