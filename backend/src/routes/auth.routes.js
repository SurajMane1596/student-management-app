import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";
import { loginBodySchema } from "../validation/authSchemas.js";
import { login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", authRateLimiter, validate(loginBodySchema), login);

export default router;
