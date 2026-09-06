import pino from "pino";
import { isProduction } from "../config/env.js";

// Structured logging. In production this emits plain JSON (for log
// aggregators); in development it's piped through pino-pretty for
// readability. Never log request bodies wholesale — see httpLogger below —
// so passwords/tokens can't leak into logs by accident.
export const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? "info" : "debug"),
  transport: isProduction
    ? undefined
    : { target: "pino-pretty", options: { colorize: true, translateTime: "HH:MM:ss" } },
  redact: {
    paths: [
      "req.headers.authorization",
      "req.body.password",
      "req.body.newPassword",
      "*.password",
      "*.passwordHash",
      "*.token",
    ],
    censor: "[REDACTED]",
  },
});
