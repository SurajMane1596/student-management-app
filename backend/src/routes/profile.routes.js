import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { updateProfileBodySchema } from "../validation/profileSchemas.js";
import { getMyProfile, updateMyProfile } from "../controllers/profile.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMyProfile);
router.put("/", validate(updateProfileBodySchema), updateMyProfile);

export default router;
