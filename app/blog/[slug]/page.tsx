import type { HTMLAttributes, ImgHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { LikeButton } from "@/components/like-button";
import { MdxPre } from "@/components/mdx-pre";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { formatDate, Tag } from "@/components/post-list";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topics?: string }>;
};

const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post || post.draft) return {};
  const path = `/blog/${post.slug}`;
  return {
    title: post.title,
    description: post.summary,
    keywords: post.tags,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": "/feed.xml" },
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      url: path,
      publishedTime: post.date,
      tags: post.tags,
      images: [`${path}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [`${path}/opengraph-image`],
    },
  };
}

export default async function PostPage({ params, searchParams }: Props) {
  const [{ slug }, { topics }] = await Promise.all([params, searchParams]);
  const post = getPost(slug);
  if (!post || post.draft) notFound();

  const selectedTopics = typeof topics === "string" ? topics.split(",").filter(Boolean) : [];
  const readingList = selectedTopics.length
    ? getAllPosts().filter((item) => selectedTopics.some((tag) => item.tags.includes(tag)))
    : getAllPosts();
  const nextPost = readingList[readingList.findIndex((item) => item.slug === post.slug) + 1];
  const topicQuery = selectedTopics.length ? `?topics=${encodeURIComponent(selectedTopics.join(","))}` : "";

  const mdxComponents = {
    pre: MdxPre,
    img: (props: ImgHTMLAttributes<HTMLImageElement>) => <img {...props} loading="lazy" decoding="async" />,
    table: (props: HTMLAttributes<HTMLTableElement>) => <table {...props} />,
    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />,
    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
    tr: (props: HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} />,
    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />,
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en",
    author: { "@type": "Person", name: "dmix", url: baseUrl },
    publisher: { "@type": "Person", name: "dmix", url: baseUrl },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${baseUrl}/blog/${post.slug}` },
    url: `${baseUrl}/blog/${post.slug}`,
    image: `${baseUrl}/blog/${post.slug}/opengraph-image`,
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <SiteHeader />
      <main className="article" id="main-content">
        <header className="article-head">
          <div className="tag-set" style={{ justifyContent: "flex-start" }}>
            {post.tags.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </div>
          <h1>{post.title}</h1>
          <p className="article-summary">{post.summary}</p>
          <div className="article-meta metadata">
            {formatDate(post.date)} · {readingTime(post.content)} min read
          </div>
        </header>
        <article className="prose">
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark", keepBackground: false }]],
              },
            }}
          />
        </article>
        <div className="like-row">
          <LikeButton slug={post.slug} />
        </div>
        <nav className="article-navigation" aria-label="Article navigation">
          <Link className="back-link" href={`/${topicQuery}`}>
            ← back
          </Link>
          {nextPost && (
            <Link className="next-link" href={`/blog/${nextPost.slug}${topicQuery}`}>
              <span className="metadata">read next →</span>
              <span>{nextPost.title}</span>
            </Link>
          )}
        </nav>
      </main>
      <SiteFooter />
    </>
  );
}

const WORDS_PER_MINUTE = 220;

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / WORDS_PER_MINUTE));
}
