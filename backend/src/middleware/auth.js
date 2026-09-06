import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "./errorHandler.js";

// Verifies the Authorization: Bearer <token> header and attaches the
// decoded payload as req.user. Every /api/* route except /auth/login and
// /health should be mounted behind this.
export function requireAuth(req, _res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(new AppError("Missing or malformed Authorization header", 401));
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);
    req.user = payload; // { sub: userId, clientId }
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
}

export function signToken(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}
