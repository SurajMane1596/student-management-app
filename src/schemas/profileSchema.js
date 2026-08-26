import { z } from "zod";
import { PATTERNS, MESSAGES } from "../utils/validators";

// Section 5.3 — View / Edit Profile
export const profileSchema = z.object({
  userName: z
    .string()
    .min(1, "User Name is required")
    .max(100, "User Name must be at most 100 characters")
    .regex(PATTERNS.alphaSpace, MESSAGES.alphaSpace),
  contactNumber: z
    .string()
    .min(1, "Contact Number is required")
    .length(10, MESSAGES.mobileLength)
    .regex(PATTERNS.digitsOnly, MESSAGES.digitsOnly),
  emailId: z.string().min(1, "Email Id is required").email("Enter a valid email address"),
  clientName: z
    .string()
    .min(1, "Client Name is required")
    .max(100, "Client Name must be at most 100 characters")
    .regex(PATTERNS.clientId, MESSAGES.clientId),
});
