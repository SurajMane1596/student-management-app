import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { customerBodySchema, listCustomersQuerySchema } from "../validation/customerSchemas.js";
import {
  listCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customer.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", validate(listCustomersQuerySchema, { source: "query" }), listCustomers);
router.get("/:id", getCustomer);
router.post("/", validate(customerBodySchema), createCustomer);
router.put("/:id", validate(customerBodySchema), updateCustomer);
router.delete("/:id", deleteCustomer);

export default router;
