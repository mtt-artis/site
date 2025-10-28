import { type FC, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { type NonIndexRouteObject, useRoutes } from "react-router";
import { ErrorComponent } from "~/components/shared/Error";

const ROUTES = import.meta.glob<{ default: FC }>(["/src/pages/**/*.tsx"]);

const routes = Object.keys(ROUTES)
  .map((route) => ({
    path: route
      .replace(/(\/src\/pages\/)|(tsx$)/g, "")
      .replace(/\[(\w+?)\]/g, ":$1")
      .replace(/\[\.{3}.*\]/g, "*")
      .replace(/\./g, "/")
      .replace(/\/$/g, ""),
    element: lazy(ROUTES[route]),
  }))
  .sort((a, b) => {
    if (a.path.endsWith("*") && !b.path.endsWith("*")) {
      return 1; // Put `a` at the end
    }
    if (!a.path.endsWith("*") && b.path.endsWith("*")) {
      return -1; // Put `b` at the end
    }
    return a.path.localeCompare(b.path); // Sort alphabetically
  });

type RouteWithSegment = Omit<NonIndexRouteObject, "children"> & {
  children?: RouteWithSegment[];
  segment: string;
};

const formatRoutes = (routesToFormat: typeof routes) => {
  const createDefaultRoute = (path = "", segment = "") => ({ path, segment }) as RouteWithSegment;
  const root = [] as RouteWithSegment[];

  for (const route of routesToFormat) {
    let node: RouteWithSegment | null = null;
    route.path.split("/").forEach((segment, index, array) => {
      const path = segment.split("_").at(0) ?? "";
      if (node === null) {
        const defaultNode = root.find((r) => r.segment === segment || r.path === "");
        if (defaultNode) {
          node = defaultNode;
        } else {
          node = createDefaultRoute(path, segment);
          root.push(node);
        }
      }
      if (index === array.length - 1) {
        const Element = route.element;
        node.children = (node.children || ([] as RouteWithSegment[])).concat({
          path,
          segment,
          element: (
            <ErrorBoundary fallback={<ErrorComponent />}>
              <Suspense>
                <Element />
              </Suspense>
            </ErrorBoundary>
          ),
        });
        return;
      }

      const searchNode = node.children?.find((node) => node.segment === segment);
      if (searchNode) {
        node = searchNode;
      } else {
        const defaultRoute = createDefaultRoute(path, segment);
        node.children = (node.children || ([] as RouteWithSegment[])).concat(defaultRoute);
        node = defaultRoute;
      }
    });
  }
  return root;
};

export const FilesRoutes = () => useRoutes(formatRoutes(routes));
