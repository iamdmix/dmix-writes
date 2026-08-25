import Link from "next/link";

export function SiteHeader() {
  return <header className="shell site-header"><Link className="brand" href="/"><span className="brand-mark">//</span>dmix writes</Link><nav className="nav"><Link href="/blog">archive</Link><a href="/rss.xml">rss</a></nav></header>;
}

export function SiteFooter() {
  return <footer className="shell site-footer"><span>© {new Date().getFullYear()} dmix</span><span>made for careful reading</span></footer>;
}
