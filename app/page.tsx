import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { StructuredData } from "@/components/structured-data";
import { getAllPosts, getAllTags } from "@/lib/posts";

type SearchParams = Promise<{ topics?: string }>;

const siteDescription = "Tech insights and system notes. Written slowly, based on real experience, and guaranteed zero AI slop.";
const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const topics = typeof searchParams.topics === "string" ? searchParams.topics.split(",") : [];
  const posts = getAllPosts();
  const tags = getAllTags();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "dmix writes",
    url: baseUrl,
    description: siteDescription,
    inLanguage: "en",
    author: { "@type": "Person", name: "dmix", url: baseUrl },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <SiteHeader />
      <main className="shell page" id="main-content">
        <section className="hero">
          <div className="hero-main">
            <h1>Thoughts from the edge of the stack.</h1>
            <p>{siteDescription}</p>
          </div>
        </section>
        <FilterablePostArchive posts={posts} tags={tags} initialTags={topics} basePath="/" />
      </main>
      <SiteFooter />
    </>
  );
}
