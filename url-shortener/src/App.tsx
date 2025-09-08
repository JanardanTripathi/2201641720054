import { useState, useEffect, useRef } from "react";
import { shortenUrl } from "./api";
import { Log } from "./logger";

export default function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ original: string; short: string }[]>([]);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("url_history");
    if (stored) setHistory(JSON.parse(stored));
    if (inputRef.current) inputRef.current.focus();
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem("url_history", JSON.stringify(history));
  }, [history]);

  async function handleShorten() {
    setError(null);
    setShortUrl(null);

    if (!/^https?:\/\//.test(url.trim())) {
      setError("⚠️ URL must start with http:// or https://");
      return;
    }

    setLoading(true);
    await Log("frontend", "info", "page", `User requested to shorten URL: ${url}`);

    const result = await shortenUrl(url);
    if (result) {
      setShortUrl(result);
      setHistory([{ original: url, short: result }, ...history]);
      await Log("frontend", "info", "api", `Shortened successfully: ${result}`);
    } else {
      setError("❌ Failed to shorten URL. Please try again.");
      await Log("frontend", "error", "api", `Shortening failed for ${url}`);
    }

    setLoading(false);
    setUrl("");
    if (inputRef.current) inputRef.current.focus();
  }

  function handleCopy(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        background: "#eef2f7",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "14px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
          maxWidth: "650px",
          width: "100%",
          animation: "fadeIn 0.5s ease",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#222" }}>
          🔗 Simple URL Shortener
        </h1>

        {/* Input and Button */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a URL (http:// or https://)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            style={{
              flex: 1,
              padding: "0.9rem",
              border: "1px solid #ccc",
              borderRadius: "8px",
              fontSize: "1rem",
              outline: "none",
            }}
          />
          <button
            onClick={handleShorten}
            disabled={loading}
            style={{
              padding: "0.9rem 1.5rem",
              background: loading ? "#6c757d" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "1rem",
              transition: "0.2s",
            }}
          >
            {loading ? (
              <span className="spinner" style={{ display: "inline-block", width: 16, height: 16, border: "3px solid #fff", borderTop: "3px solid transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            ) : (
              "Shorten"
            )}
          </button>
        </div>

        {/* Feedback */}
        {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}
        {shortUrl && (
          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              background: "#f1f8ff",
              border: "1px solid #cce5ff",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <a href={shortUrl} target="_blank" rel="noopener noreferrer" style={{ color: "#007bff" }}>
              {shortUrl}
            </a>
            <button
              onClick={() => handleCopy(shortUrl)}
              style={{
                marginLeft: "1rem",
                padding: "0.5rem 0.75rem",
                background: copied === shortUrl ? "#28a745" : "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              {copied === shortUrl ? "✔ Copied" : "Copy"}
            </button>
          </div>
        )}

        {/* History */}
        <div style={{ marginTop: "2rem" }}>
          <h3 style={{ marginBottom: "0.75rem" }}>History</h3>
          {history.length === 0 ? (
            <p style={{ color: "#666" }}>No shortened URLs yet. Try one above!</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {history.map((item, idx) => (
                <li
                  key={idx}
                  style={{
                    padding: "0.75rem",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    animation: "fadeIn 0.3s ease",
                  }}
                >
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <p style={{ margin: 0, fontSize: "0.85rem", color: "#555" }}>{item.original}</p>
                    <a
                      href={item.short}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: "0.9rem", color: "#007bff" }}
                    >
                      {item.short}
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(item.short)}
                    style={{
                      marginLeft: "1rem",
                      padding: "0.4rem 0.7rem",
                      background: copied === item.short ? "#28a745" : "#6c757d",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.8rem",
                    }}
                  >
                    {copied === item.short ? "✔ Copied" : "Copy"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}