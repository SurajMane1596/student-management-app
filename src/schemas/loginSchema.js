import { z } from "zod";
import { PATTERNS, MESSAGES } from "../utils/validators";

// Section 5.1 — Login Screen
export const loginSchema = z.object({
  clientId: z
    .string()
    .min(1, "Client Id is required")
    .max(8, "Client Id must be at most 8 characters")
    .regex(PATTERNS.clientId, MESSAGES.clientId),
  mobileNumber: z
    .string()
    .min(1, "Mobile Number is required")
    .length(10, MESSAGES.mobileLength)
    .regex(PATTERNS.digitsOnly, MESSAGES.digitsOnly),
  password: z
    .string()
    .min(1, "Password is required")
    .max(15, "Password must be at most 15 characters")
    .regex(PATTERNS.password, MESSAGES.password),
});
