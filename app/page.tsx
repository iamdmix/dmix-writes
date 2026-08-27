import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { getAllPosts, getAllTags } from "@/lib/posts";

type SearchParams = Promise<{ topics?: string }>;

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const topics = typeof searchParams.topics === "string" ? searchParams.topics.split(",") : [];
  const posts = getAllPosts();
  const tags = getAllTags();
  
  return (
    <>
      <SiteHeader />
      <main className="shell page">
        <section className="hero">
          <div className="hero-main">
            <h1>Thoughts from the edge of the stack.</h1>
            <p>A collection of tech observations, system notes, and practical findings from lived engineering work. Written slowly, based on experience, and guaranteed to be free of AI-generated slop.</p>
          </div>
          <div className="hero-stamp-card">
            <div className="stamp-badge">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 276 276"
                style={{ flexShrink: 0 }}
                aria-hidden="true"
              >
                <circle cx="138" cy="138" r="124" stroke="var(--accent)" strokeWidth="28" fill="none" />
                <rect x="80" y="14" width="32" height="242" fill="var(--text-main)" transform="skewX(-9)" />
                <rect x="92" y="14" width="32" height="242" fill="var(--text-main)" transform="skewX(9)" />
                <rect x="78" y="173" width="50" height="32" fill="var(--text-main)" />
                <rect x="180" y="15" width="36" height="230" fill="var(--text-main)" />
                <circle cx="138" cy="138" r="124" stroke="var(--accent)" strokeWidth="28" fill="none" strokeDasharray="390" />
                <line x1="45" y1="45" x2="231" y2="231" stroke="var(--accent)" strokeWidth="22" />
              </svg>
              <div className="stamp-text">
                <span className="stamp-title">HUMAN WRITTEN</span>
                <span className="stamp-subtitle">zero generated slop</span>
              </div>
            </div>
          </div>
        </section>
        <FilterablePostArchive posts={posts} tags={tags} initialTags={topics} basePath="/" />
      </main>
      <SiteFooter />
    </>
  );
}
