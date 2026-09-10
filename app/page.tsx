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
      <main className="shell page" id="main-content">
        <section className="hero">
          <div className="hero-main">
            <h1>Thoughts from the edge of the stack.</h1>
            <p>Tech insights and system notes. Written slowly, based on real experience, and guaranteed zero AI slop.</p>
          </div>
        </section>
        <FilterablePostArchive posts={posts} tags={tags} initialTags={topics} basePath="/" />
      </main>
      <SiteFooter />
    </>
  );
}
