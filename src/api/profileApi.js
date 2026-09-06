import * as mockApi from "../data/mockApi";
import { apiFetch, USE_REAL_BACKEND } from "./httpClient";

// clientId is only needed by the mock (which has no concept of "the
// logged-in user" beyond a passed-in id); the real backend identifies the
// user from the JWT, so it's accepted here but ignored.
export async function updateProfile(clientId, updates) {
  if (!USE_REAL_BACKEND) return mockApi.updateProfile(clientId, updates);
  return apiFetch("/profile", { method: "PUT", body: updates });
}
