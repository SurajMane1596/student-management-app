import * as mockApi from "../data/mockApi";
import { apiFetch, USE_REAL_BACKEND } from "./httpClient";

// ownerClientId is only needed by the mock; the real backend scopes
// customers to the logged-in user via the JWT and ignores it.
export async function listCustomers(ownerClientId) {
  if (!USE_REAL_BACKEND) return mockApi.listCustomers(ownerClientId);
  return apiFetch("/customers");
}

export async function getCustomer(id) {
  if (!USE_REAL_BACKEND) return mockApi.getCustomer(id);
  return apiFetch(`/customers/${id}`);
}

export async function createCustomer(ownerClientId, data) {
  if (!USE_REAL_BACKEND) return mockApi.createCustomer(ownerClientId, data);
  return apiFetch("/customers", { method: "POST", body: data });
}

export async function updateCustomer(id, data) {
  if (!USE_REAL_BACKEND) return mockApi.updateCustomer(id, data);
  return apiFetch(`/customers/${id}`, { method: "PUT", body: data });
}

export async function deleteCustomer(id) {
  if (!USE_REAL_BACKEND) {
    return { ok: false, error: "Delete is not supported in the local demo mode." };
  }
  return apiFetch(`/customers/${id}`, { method: "DELETE" });
}
