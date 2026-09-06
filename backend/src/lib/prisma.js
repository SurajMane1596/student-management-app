import { PrismaClient } from "@prisma/client";
import { isProduction } from "../config/env.js";

/**
 * Prisma client singleton.
 *
 * Neon is serverless Postgres fronted by PgBouncer (the pooled
 * DATABASE_URL). Prisma's own connection pool sits in front of that, so in
 * a long-running Node server (this Express app, as opposed to a
 * per-request serverless function) a single shared client is correct and
 * avoids exhausting Neon's connection limit. If this backend is later
 * deployed as serverless functions instead, switch to Prisma's Accelerate
 * or Data Proxy, or instantiate per-invocation with care — the current
 * DATABASE_URL/DIRECT_URL split already anticipates that migration.
 *
 * The global-caching pattern below also prevents creating a new client on
 * every hot-reload in development.
 */
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma ??
  new PrismaClient({
    log: isProduction ? ["error", "warn"] : ["warn", "error"],
  });

if (!isProduction) {
  globalForPrisma.__prisma = prisma;
}

export async function disconnectPrisma() {
  await prisma.$disconnect();
}
