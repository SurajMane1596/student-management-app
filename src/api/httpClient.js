import { getToken, clearToken } from "./tokenStore";

/**
 * Whether a real backend is configured. When VITE_API_BASE_URL is unset,
 * every src/api/*Api.js module falls back to the original localStorage
 * mock in src/data/mockApi.js — so the app runs standalone with zero
 * backend setup, and pointing this one env var at a real server switches
 * every page to live data with no other code changes.
 */
export const USE_REAL_BACKEND = Boolean(import.meta.env.VITE_API_BASE_URL);

console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Thin fetch wrapper that:
 * - prefixes BASE_URL and attaches the bearer token when present
 * - always resolves (never throws) with a { ok, ...} shaped result,
 *   mirroring src/data/mockApi.js's return contract so every page can
 *   handle mock and real responses identically
 * - clears the stored token on a 401 so a stale/expired session doesn't
 *   linger
 */
export async function apiFetch(
  path,
  { method = "GET", body, auth = true } = {},
) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Please check your connection.",
    };
  }

  if (response.status === 204) return { ok: true };

  let data;
  try {
    data = await response.json();
  } catch {
    return { ok: false, error: "Unexpected response from the server." };
  }

  if (response.status === 401 && auth) clearToken();

  // Backend already returns { ok, ... } on both success and failure, so
  // this mostly passes it straight through — this is the one seam where
  // that contract is enforced even if a future endpoint forgets it.
  return { ok: response.ok, ...data };
}
