import type { HTMLAttributes, ImgHTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { LikeButton } from "@/components/like-button";
import { MdxPre } from "@/components/mdx-pre";
import { ProseImage } from "@/components/prose-image";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { StructuredData } from "@/components/structured-data";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { formatDate, Tag } from "@/components/post-list";
import { getAllPosts, getPost, getRelatedPosts } from "@/lib/posts";
import { breadcrumbJsonLd, postJsonLd } from "@/lib/seo";
import { siteName } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topics?: string }>;
};

const WORDS_PER_MINUTE = 220;

export const dynamicParams = false;

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
      modifiedTime: post.updated ?? undefined,
      tags: post.tags,
      images: [{ url: `${path}/opengraph-image`, alt: post.title, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.summary,
      images: [{ url: `${path}/opengraph-image`, alt: post.title }],
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
  const relatedPosts = getRelatedPosts(post);
  const words = post.content.trim().split(/\s+/).length;
  const heroImageSrc = post.content.match(/!\[[^\]]*\]\((\/blog\/[^)\s]+)\)/)?.[1];

  const mdxComponents = {
    pre: MdxPre,
    img: (props: ImgHTMLAttributes<HTMLImageElement>) => (
      <ProseImage {...props} priority={props.src === heroImageSrc} />
    ),
    table: (props: HTMLAttributes<HTMLTableElement>) => <table {...props} />,
    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />,
    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
    tr: (props: HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} />,
    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />,
  };

  const structuredData = [
    postJsonLd({
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      date: post.date,
      updated: post.updated,
      tags: post.tags,
      wordCount: words,
    }),
    breadcrumbJsonLd([
      { name: siteName, path: "/" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      <StructuredData data={structuredData} />
      <SiteHeader />
      <main className="article" id="main-content">
        <Breadcrumbs
          items={[
            { name: siteName, path: "/" },
            { name: post.title, path: `/blog/${post.slug}` },
          ]}
        />
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
                rehypePlugins: [[rehypePrettyCode, { theme: "github-dark-high-contrast", keepBackground: false }]],
              },
            }}
          />
        </article>
        <div className="like-row">
          <LikeButton slug={post.slug} />
        </div>
        <nav className="article-navigation" aria-label="Article navigation">
          <Link className="back-link" href={`/${topicQuery}`}>
            ← all writing
          </Link>
          {nextPost && (
            <Link className="next-link" href={`/blog/${nextPost.slug}${topicQuery}`}>
              <span className="metadata">read next →</span>
              <span>{nextPost.title}</span>
            </Link>
          )}
        </nav>
        {relatedPosts.length > 0 && (
          <section className="related-posts" aria-label="Related reading">
            <h2 className="metadata">related reading</h2>
            <ul>
              {relatedPosts.map((item) => (
                <li key={item.slug}>
                  <Link href={`/blog/${item.slug}`}>
                    <span>{item.title}</span>
                    <span className="metadata">{formatDate(item.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

function readingTime(content: string): number {
  return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / WORDS_PER_MINUTE));
}
