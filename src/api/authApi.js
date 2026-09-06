import * as mockApi from "../data/mockApi";
import { apiFetch, USE_REAL_BACKEND } from "./httpClient";
import { setToken, clearToken, getToken } from "./tokenStore";

export async function login(credentials) {
  if (!USE_REAL_BACKEND) return mockApi.login(credentials);

  const res = await apiFetch("/auth/login", {
    method: "POST",
    body: credentials,
    auth: false,
  });
  if (res.ok) setToken(res.token);
  return res;
}

export async function logout() {
  if (!USE_REAL_BACKEND) return mockApi.logout();
  clearToken();
  return { ok: true };
}

export async function getSession() {
  if (!USE_REAL_BACKEND) return mockApi.getSession();

  if (!getToken()) return { ok: false };
  // The real backend has no separate "session" endpoint — fetching the
  // profile both validates the stored token and returns the user in one
  // call, which is exactly what getSession's callers need.
  return apiFetch("/profile");
}
