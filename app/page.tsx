import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function Home() { const posts = getAllPosts(); const tags = getAllTags(); return <><SiteHeader /><main className="shell page"><section className="hero hero-minimal"><div><h1>Thoughts from the edge of the stack.</h1><p>Notes on building systems that stay understandable under pressure — written by dmix.</p></div></section><FilterablePostArchive posts={posts} tags={tags} basePath="/" /></main><SiteFooter /></>; }
