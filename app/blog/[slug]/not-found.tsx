import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function BlogNotFound() {
  return (
    <>
      <SiteHeader />
      <main className="shell page" style={{ textAlign: "center", padding: "120px 0" }}>
        <h1 style={{ fontSize: "clamp(45px, 6vw, 74px)", letterSpacing: "-.07em", fontWeight: 650 }}>
          404
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 17, lineHeight: 1.65, margin: "20px 0 40px" }}>
          That post doesn&apos;t exist.
        </p>
        <Link
          href="/"
          style={{
            color: "var(--accent)",
            font: "14px var(--font-jetbrains-mono), monospace",
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          ← back to writing
        </Link>
      </main>
      <SiteFooter />
    </>
  );
}
