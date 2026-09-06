import { asyncHandler } from "../middleware/errorHandler.js";
import * as profileService from "../services/profile.service.js";

export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.getProfile(req.user.sub);
  res.json({ ok: true, user });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await profileService.updateProfile(req.user.sub, req.body);
  res.json({ ok: true, user });
});
