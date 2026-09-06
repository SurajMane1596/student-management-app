import { z } from "zod";
import { PATTERNS } from "./patterns.js";

export const loginBodySchema = z.object({
  clientId: z.string().min(1).max(8).regex(PATTERNS.clientId),
  mobileNumber: z.string().length(10).regex(PATTERNS.digitsOnly),
  password: z.string().min(1).max(15).regex(PATTERNS.password),
});
