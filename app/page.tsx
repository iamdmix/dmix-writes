import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { StructuredData } from "@/components/structured-data";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { blogJsonLd, profilePageJsonLd, siteDescription, siteName, personJsonLd, webSiteJsonLd } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";

type SearchParams = Promise<{ topics?: string }>;

export const metadata: Metadata = {
  title: { absolute: "dmix writes — engineering notes on systems and software" },
  description: siteDescription,
  alternates: { canonical: "/", types: { "application/rss+xml": "/feed.xml" } },
  openGraph: {
    type: "website",
    title: siteName,
    description: siteDescription,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description: siteDescription,
  },
};

export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  const topics = typeof searchParams.topics === "string" ? searchParams.topics.split(",") : [];
  const posts = getAllPosts();
  const tags = getAllTags();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      personJsonLd(),
      webSiteJsonLd(),
      blogJsonLd(posts.map((post) => absoluteUrl(`/blog/${post.slug}`))),
      profilePageJsonLd(),
    ],
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
