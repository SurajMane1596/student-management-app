import express from "express";
import helmet from "helmet";
import cors from "cors";
import pinoHttp from "pino-http";
import { env, isProduction } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { apiRateLimiter } from "./middleware/rateLimiter.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import customerRoutes from "./routes/customer.routes.js";

export function createApp() {
  const app = express();

  // Required when deployed behind a reverse proxy / load balancer (Render,
  // Railway, Fly, etc.) so req.ip and rate limiting see the real client IP.
  if (isProduction) app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res, err) => {
        if (err || res.statusCode >= 500) return "error";
        if (res.statusCode >= 400) return "warn";
        return "info";
      },
      // Keep request logs to method/url/status/latency/id — never the body,
      // so tokens/passwords can't end up in logs even if redact.paths
      // above misses a shape.
      serializers: {
        req: (req) => ({ method: req.method, url: req.url, id: req.id }),
      },
    })
  );

  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/profile", apiRateLimiter, profileRoutes);
  app.use("/api/customers", apiRateLimiter, customerRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
