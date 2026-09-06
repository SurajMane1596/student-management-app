import { z } from "zod";
import { PATTERNS } from "./patterns.js";

export const updateProfileBodySchema = z.object({
  userName: z.string().min(1).max(100).regex(PATTERNS.alphaSpace),
  contactNumber: z.string().length(10).regex(PATTERNS.digitsOnly),
  emailId: z.string().min(1).email(),
  clientName: z.string().min(1).max(100).regex(PATTERNS.clientId),
});
