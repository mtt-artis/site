import { Glob, serve, file } from "bun";
import index from "./index.html"

const routes = await Array.fromAsync(new Glob("{snippets}/**/*.{ts,tsx,sql}").scan()).then(r => r.map(r => `/${r}`));

const json = routes.reduce<Record<string, Record<string, string[]>>>((acc, route) => {
  const [_ ,category, tag, name] = route.split("/");
  if (!category || !tag || !name) return acc;
  acc[category] ??= {};
  acc[category][tag] ??= [];
  acc[category][tag].push(route);
  return acc;
}, {});

// file("data.json").write(JSON.stringify(json, null, 2))

const server = serve({
  routes: {
    "/site": index,
    "/data.json": Response.json(json),
    ...Object.fromEntries(routes.map(r => [r, new Response(file(r))]))
  },
});

console.log(`Server listening on ${server.hostname}:${server.port}`);
