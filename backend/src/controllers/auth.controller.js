import { asyncHandler } from "../middleware/errorHandler.js";
import { loginUser } from "../services/auth.service.js";

export const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);
  res.json({ ok: true, ...result });
});
