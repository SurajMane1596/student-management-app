import { asyncHandler } from "../middleware/errorHandler.js";
import * as customerService from "../services/customer.service.js";

export const listCustomers = asyncHandler(async (req, res) => {
  const result = await customerService.listCustomers(req.user.sub, req.query);
  res.json({ ok: true, ...result });
});

export const getCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.getCustomer(req.user.sub, req.params.id);
  res.json({ ok: true, customer });
});

export const createCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.createCustomer(req.user.sub, req.body);
  res.status(201).json({ ok: true, customer });
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const customer = await customerService.updateCustomer(req.user.sub, req.params.id, req.body);
  res.json({ ok: true, customer });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  await customerService.deleteCustomer(req.user.sub, req.params.id);
  res.status(204).send();
});
