import type { APIEvent } from "@solidjs/start/server";
import { CamelCasePlugin, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import { getUserFromSession } from "~/server/auth";
import type { DB } from "~/server/db";
import { log } from "~/server/logger";

export const GET = async (ctx: APIEvent) => {
  await getUserFromSession();

  // Bun.SQL DOES NOT HAVE STREAMING YET
  const db = new Kysely<DB>({
    dialect: new PostgresJSDialect({
      postgres: postgres({
        port: process.env.DATABASE_PORT,
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE_DB,
      }),
    }),
    plugins: [new CamelCasePlugin()],
  });

  const separator = ctx.request.headers.get("accept-language")?.startsWith("fr") ? ";" : ",";

  const url = new URL(ctx.request.url);
  const search = Object.fromEntries(url.searchParams.entries());

  const headers = [
    "id",
    "title",
    "done",
    "createdBy",
    "createdAt",
    "updatedAt",
  ] as const;

  return new Response(
    new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          controller.enqueue(encoder.encode(`${headers.join(separator)}\n`));

          let query = db.selectFrom("todos")

          if (typeof search.done === "string") query = query.where("testMeasures.createdAt", "=", search.done === "true");

          for await (const d of query.stream(20)) {
            controller.enqueue(
              encoder.encode(
                `${headers
                  .map((h) => {
                    const v = d[h];
                    return v instanceof Date ? v.toISOString() : v;
                  })
                  .join(separator)}\n`,
              ),
            );
          }
        } catch (error) {
          log.error(error);
        } finally {
          controller.close();
        }
      },
    }),
    {
      headers: {
        "Content-Disposition": `attachment; filename=${ctx.params.materialId}-${Date.now()}.csv`,
      },
    },
  );
};
