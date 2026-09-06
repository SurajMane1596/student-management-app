import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { disconnectPrisma } from "./lib/prisma.js";

const app = createApp();

const server = app.listen(env.port, () => {
  logger.info(`Server listening on port ${env.port} [${env.nodeEnv}]`);
});

// Close the HTTP server and Prisma's connection pool cleanly on shutdown
// signals, so in-flight requests finish and Neon connections aren't left
// dangling (important given Neon's connection-limited pooled endpoint).
async function shutdown(signal) {
  logger.info(`${signal} received, shutting down gracefully...`);
  server.close(async () => {
    await disconnectPrisma();
    logger.info("Shutdown complete.");
    process.exit(0);
  });

  // Force-exit if something hangs longer than 10s.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

process.on("unhandledRejection", (reason) => {
  logger.error({ reason }, "Unhandled promise rejection");
});
