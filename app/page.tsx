import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { getAllPosts, getAllTags } from "@/lib/posts";

export default function Home() { const posts=getAllPosts(); const tags=getAllTags(); return <><SiteHeader/><main className="shell page"><section className="hero"><div><div className="eyebrow">Engineering field notes</div><h1>Thoughts from the edge of the stack.</h1><p>Notes on building systems that stay understandable under pressure — written by dmix.</p></div><aside className="hero-note"><b>THE PRACTICE</b>Made slowly, from lived work and honest curiosity.<br/>0% generated filler.</aside></section><FilterablePostArchive posts={posts} tags={tags} basePath="/"/></main><SiteFooter/></>; }
