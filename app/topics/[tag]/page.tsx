import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ tag: string }> };

function findTag(value: string): string | undefined {
  return getAllTags().find((tag) => tag.toLowerCase() === value.toLowerCase());
}

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tag = findTag((await params).tag);
  if (!tag) return {};
  const path = `/topics/${encodeURIComponent(tag)}`;
  const description = `Every dmix writes post tagged ${tag} — systems, software, and the odd sharp edge.`;
  return {
    title: `${tag} articles`,
    description,
    alternates: { canonical: path, types: { "application/rss+xml": "/feed.xml" } },
    openGraph: {
      type: "website",
      title: `${tag} articles · dmix writes`,
      description,
      url: path,
    },
    twitter: {
      card: "summary_large_image",
      title: `${tag} articles · dmix writes`,
      description,
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const tag = findTag((await params).tag);
  if (!tag) notFound();

  const posts = getAllPosts();
  const topicCount = posts.filter((post) => post.tags.includes(tag)).length;
  const encodedTag = encodeURIComponent(tag);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tag} articles`,
    url: `${siteUrl}/topics/${encodedTag}`,
    description: `Posts tagged ${tag} on dmix writes.`,
    isPartOf: { "@type": "WebSite", name: "dmix writes", url: siteUrl },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <SiteHeader />
      <main className="shell page" id="main-content">
        <section className="hero hero-minimal">
          <div className="hero-main">
            <p className="eyebrow">topic</p>
            <h1 className="archive-title topic-title">#{tag}</h1>
            <p>
              {topicCount} {topicCount === 1 ? "note" : "notes"} on {tag}. Filter by any topic below, or{" "}
              <Link href="/">browse everything</Link>.
            </p>
          </div>
        </section>
        <FilterablePostArchive posts={posts} tags={getAllTags()} initialTags={[tag]} basePath={`/topics/${encodedTag}`} />
      </main>
      <SiteFooter />
    </>
  );
}
