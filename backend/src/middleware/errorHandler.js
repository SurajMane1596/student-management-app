import { logger } from "../utils/logger.js";
import { isProduction } from "../config/env.js";

export class AppError extends Error {
  constructor(message, statusCode = 500, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Every error response, whatever the source, is shaped the same way so the
// frontend can handle failures with one code path:
// { ok: false, error: string, details?: unknown }
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;

  if (statusCode >= 500) {
    logger.error({ err, path: req.path }, "Unhandled error");
  } else {
    logger.warn({ err: err.message, path: req.path }, "Request error");
  }

  res.status(statusCode).json({
    ok: false,
    error: statusCode >= 500 && isProduction ? "Internal server error" : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({ ok: false, error: `Route not found: ${req.method} ${req.path}` });
}

// Wrap async route handlers so thrown/rejected errors reach errorHandler
// instead of crashing the process or hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
