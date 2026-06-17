import fp from "fastify-plugin";
import { sql } from "drizzle-orm";
import { db } from "@vistoria/db";
import { verifyAccess } from "./tokens";
import { errors } from "../errors/app-error";
import type { Tx } from "./types";
import "./types";

interface AuthContextOptions {
  accessSecret: string;
  publicRoutes: string[];
  publicPrefixes?: string[];
}

// A deferred-resolution transaction: we open db.transaction, hand the tx to the
// request, and only resolve/reject the surrounding promise from onResponse/onError
// so the whole route handler runs inside the same RLS-scoped transaction.
interface PendingTx {
  tx: Tx;
  commit: () => void;
  rollback: (err: unknown) => void;
  done: Promise<void>;
}

function openTx(): Promise<PendingTx> {
  return new Promise((resolveOuter, rejectOuter) => {
    let settle: { commit: () => void; rollback: (e: unknown) => void } | undefined;
    const done = db
      .transaction(async (tx) => {
        await new Promise<void>((resolveInner, rejectInner) => {
          settle = { commit: resolveInner, rollback: rejectInner };
          resolveOuter({
            tx,
            commit: resolveInner,
            rollback: rejectInner,
            done, // assigned below
          });
        });
      })
      .catch((e) => {
        // rollback path: swallow here; the request already saw the error via onError.
        if (!settle) rejectOuter(e);
      });
  });
}

export const authContextPlugin = fp<AuthContextOptions>(async (app, opts) => {
  app.addHook("preHandler", async (request) => {
    const url = request.url.split("?")[0]!;
    if (opts.publicRoutes.includes(url)) return;
    if (opts.publicPrefixes?.some((p) => url.startsWith(p))) return;

    const header = request.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      throw errors.unauthorized("Missing bearer token");
    }
    let payload;
    try {
      payload = verifyAccess(header.slice("Bearer ".length), opts.accessSecret);
    } catch {
      throw errors.unauthorized("Invalid or expired token");
    }

    request.ctx = {
      userId: payload.sub,
      tenantId: payload.tenantId,
      role: payload.role,
    };

    const pending = await openTx();
    request.tx = pending.tx;
    (request as unknown as { _pendingTx: PendingTx })._pendingTx = pending;

    await pending.tx.execute(
      sql`SELECT set_config('app.tenant_id', ${request.ctx.tenantId ?? ""}, true)`,
    );
    await pending.tx.execute(
      sql`SELECT set_config('app.role', ${request.ctx.role}, true)`,
    );
  });

  app.addHook("onError", async (request, _reply, error) => {
    const pending = (request as unknown as { _pendingTx?: PendingTx })._pendingTx;
    if (pending) {
      (request as unknown as { _pendingTx?: PendingTx })._pendingTx = undefined;
      pending.rollback(error);
      await pending.done.catch(() => undefined);
    }
  });

  app.addHook("onSend", async (request, reply, payload) => {
    const pending = (request as unknown as { _pendingTx?: PendingTx })._pendingTx;
    if (pending) {
      if (reply.statusCode >= 400) pending.rollback(new Error("rolled back"));
      else pending.commit();
      await pending.done.catch(() => undefined);
      (request as unknown as { _pendingTx?: PendingTx })._pendingTx = undefined;
    }
    return payload;
  });
});
