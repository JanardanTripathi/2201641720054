// src/logger.ts
import { getToken, refreshToken } from "./tokenManager";

const LOG_API = import.meta.env.VITE_LOG_API || "http://20.244.56.144/evaluation-service/logs";

const ALLOWED_STACK = ["frontend"];
const ALLOWED_LEVELS = ["debug", "info", "warn", "error", "fatal"];
const ALLOWED_PACKAGES = ["api", "component", "hook", "page", "state", "style"];

function sanitize(level: string, pkg: string, stack = "frontend") {
  const l = level?.toLowerCase();
  const p = pkg?.toLowerCase();
  const s = stack?.toLowerCase();
  if (!ALLOWED_STACK.includes(s)) throw new Error(`stack must be one of ${ALLOWED_STACK.join(",")}`);
  if (!ALLOWED_LEVELS.includes(l)) throw new Error(`level must be one of ${ALLOWED_LEVELS.join(",")}`);
  if (!ALLOWED_PACKAGES.includes(p)) throw new Error(`package must be one of ${ALLOWED_PACKAGES.join(",")}`);
  return { stack: s, level: l, package: p };
}

async function doSend(payload: any, token: string | null) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(LOG_API, { method: "POST", headers, body: JSON.stringify(payload) });
}

export async function Log(stack: string, level: string, pkg: string, message: string) {
  try {
    const { stack: s, level: l, package: p } = sanitize(level, pkg, stack);
    const payload = { stack: s, level: l, package: p, message };

    let token = await getToken();
    let res = await doSend(payload, token);

    if (res.status === 401 || res.status === 403) {
      console.warn("[logger] token expired, refreshing…");
      token = await refreshToken();
      res = await doSend(payload, token);
    }

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[logger] failed", res.status, text);
      return null;
    }
    return res.json().catch(() => null);
  } catch (err: any) {
    console.error("[logger] invalid params or failed:", err?.message ?? err);
    return null;
  }
}

export async function captureError(pkg: string, message: string) {
  const stack = new Error().stack ?? "stackless";
  return Log("frontend", "error", pkg, `${message}\n${stack}`);
}