// src/utils.ts
export function isProbablyUrl(s: string) {
  if (!s) return false;
  try {
    new URL(s.includes("://") ? s : "https://" + s);
    return true;
  } catch {
    return false;
  }
}

export function saveHistory(item: { original: string; short: string }) {
  try {
    const raw = localStorage.getItem("shortHistory");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift({ ...item, createdAt: Date.now() });
    localStorage.setItem("shortHistory", JSON.stringify(arr.slice(0, 30)));
  } catch {}
}

export function loadHistory() {
  try {
    const raw = localStorage.getItem("shortHistory");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(text);
    return true;
  } else {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    return true;
  }
}