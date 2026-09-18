import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/components/post-list";

const recentPosts = () => getAllPosts().slice(0, 3);

export default function NotFound() {
  const posts = recentPosts();
  return (
    <>
      <SiteHeader />
      <main className="shell page not-found-page" id="main-content">
        <section className="not-found">
          <p className="not-found-code" aria-hidden="true">
            4<span className="not-found-slash">{"//"}</span>4
          </p>
          <h1>Page Not Found</h1>
          <p className="not-found-copy">
            The page you were reading drifted out of the stack. It may have been moved, renamed, or
            never written at all.
          </p>
          <div className="not-found-actions">
            <Link className="not-found-cta" href="/">
              ← back to all writing
            </Link>
            <Link className="not-found-secondary" href="/feed.xml">
              subscribe via rss
            </Link>
          </div>
          {posts.length > 0 && (
            <section className="not-found-posts" aria-label="Recent writing">
              <h2 className="metadata">recent writing</h2>
              <ul>
                {posts.map((post) => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`}>
                      <span>{post.title}</span>
                      <span className="metadata">{formatDate(post.date)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
