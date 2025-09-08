// src/api.ts
export async function shortenUrl(originalUrl: string): Promise<string | null> {
  try {
    const res = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(originalUrl)}`);
    if (!res.ok) throw new Error(`TinyURL API failed: ${res.status}`);
    const shortUrl = await res.text();
    return shortUrl.startsWith("http") ? shortUrl : null;
  } catch (err) {
    console.error("[api] shortenUrl failed:", err);
    return null;
  }
}
