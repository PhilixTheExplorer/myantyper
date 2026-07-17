"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f1e7d0",
          color: "#2a1a08",
          fontFamily: "'Courier New', monospace",
          textAlign: "center",
          padding: 24,
        }}
      >
        <div style={{ maxWidth: 460 }}>
          <div
            style={{
              letterSpacing: "0.35em",
              fontSize: 11,
              textTransform: "uppercase",
              color: "#7a5028",
            }}
          >
            Fatal
          </div>
          <h1 style={{ fontSize: 30, margin: "10px 0 6px" }}>
            The press broke down
          </h1>
          <p style={{ color: "#7a5028", fontSize: 14, lineHeight: 1.6 }}>
            A fatal error stopped MyanTyper from loading. Reloading usually
            clears it.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 18,
              padding: "10px 18px",
              fontSize: 12,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "#8b1a1a",
              color: "#fff3d8",
              border: "1px solid #8b1a1a",
              cursor: "pointer",
            }}
          >
            ↻ Reload
          </button>
        </div>
      </body>
    </html>
  );
}
