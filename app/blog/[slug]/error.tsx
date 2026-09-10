"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="shell page" style={{ textAlign: "center", padding: "120px 0" }}>
      <h1 style={{ fontSize: "clamp(45px, 6vw, 74px)", letterSpacing: "-.07em", fontWeight: 650 }}>
        Something went wrong
      </h1>
      <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.65, margin: "20px 0 40px" }}>
        An unexpected error occurred.
      </p>
      <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
        <button
          onClick={() => reset()}
          style={{
            appearance: "none",
            background: "var(--accent)",
            color: "#fffaf5",
            border: 0,
            padding: "10px 20px",
            borderRadius: 6,
            font: "14px var(--font-jetbrains-mono), monospace",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
        <Link
          href="/"
          style={{
            color: "var(--accent)",
            font: "14px var(--font-jetbrains-mono), monospace",
            display: "flex",
            alignItems: "center",
          }}
        >
          ← back to writing
        </Link>
      </div>
    </main>
  );
}
