import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  return (
    <header className="shell site-header">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Link className="brand" href="/">
        <span className="brand-mark">//</span>dmix writes
      </Link>
      <nav className="nav">
        <a href="/feed.xml" className="nav-rss" title="Subscribe via RSS">
          rss
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="shell site-footer">
      <span>© {new Date().getFullYear()} dmix · <a href="/feed.xml" className="footer-rss">rss</a></span>
      <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        made for careful reading
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 276 276"
          style={{ verticalAlign: "middle", display: "inline-block", opacity: 0.8 }}
          aria-label="No AI Generated Content Logo"
          role="img"
        >
          <circle cx="138" cy="138" r="124" stroke="#B30000" strokeWidth="28" fill="none" />
          <rect x="80" y="14" width="32" height="242" fill="currentColor" transform="skewX(-9)" />
          <rect x="92" y="14" width="32" height="242" fill="currentColor" transform="skewX(9)" />
          <rect x="78" y="173" width="50" height="32" fill="currentColor" />
          <rect x="180" y="15" width="36" height="230" fill="currentColor" />
          <circle cx="138" cy="138" r="124" stroke="#B30000" strokeWidth="28" fill="none" strokeDasharray="390" />
          <line x1="45" y1="45" x2="231" y2="231" stroke="#B30000" strokeWidth="22" />
        </svg>
      </span>
    </footer>
  );
}
