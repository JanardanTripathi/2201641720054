// src/tokenManager.ts
const STATIC_TOKEN = import.meta.env.VITE_ACCESS_TOKEN;
const AUTH_URL = import.meta.env.VITE_AUTH_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

let cachedToken: string | null = STATIC_TOKEN ?? null;
let expiresAt = 0;

async function fetchTokenViaAuthUrl(): Promise<string | null> {
  if (!AUTH_URL || !CLIENT_ID || !CLIENT_SECRET) {
    console.warn("[tokenManager] Missing AUTH_URL / CLIENT_ID / CLIENT_SECRET");
    return null;
  }

  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[tokenManager] Auth request failed", res.status, text);
      return null;
    }

    const json = await res.json();
    if (json.access_token) {
      cachedToken = json.access_token;

      // Handle expires_in (absolute or relative)
      if (typeof json.expires_in === "number" && json.expires_in > 1e12) {
        // Absolute timestamp
        expiresAt = json.expires_in * 1000 - 60_000;
      } else if (typeof json.expires_in === "number") {
        // Relative seconds
        expiresAt = Date.now() + json.expires_in * 1000 - 60_000;
      } else {
        expiresAt = Date.now() + 3600_000; // default 1h
      }

      console.info("[tokenManager] Got new token, expires at", new Date(expiresAt).toISOString());
      return cachedToken;
    }

    console.error("[tokenManager] Response missing access_token", json);
    return null;
  } catch (err) {
    console.error("[tokenManager] Failed to fetch token", err);
    return null;
  }
}

export async function getToken(): Promise<string | null> {
  if (cachedToken && Date.now() < expiresAt) return cachedToken;
  if (cachedToken && !AUTH_URL) return cachedToken; // static token fallback
  return fetchTokenViaAuthUrl();
}

export async function refreshToken(): Promise<string | null> {
  expiresAt = 0;
  cachedToken = null;
  return fetchTokenViaAuthUrl();
}