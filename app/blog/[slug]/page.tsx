import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import { MdxPre } from "@/components/mdx-pre";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { formatDate, Tag } from "@/components/post-list";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ topics?: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post || post.draft) return {};
  return {
    title: post.title,
    description: post.summary,
    openGraph: { images: [`/blog/${post.slug}/opengraph-image`] },
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
    table: (props: HTMLAttributes<HTMLTableElement>) => <table {...props} />,
    thead: (props: HTMLAttributes<HTMLTableSectionElement>) => <thead {...props} />,
    tbody: (props: HTMLAttributes<HTMLTableSectionElement>) => <tbody {...props} />,
    tr: (props: HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
    th: (props: ThHTMLAttributes<HTMLTableCellElement>) => <th {...props} />,
    td: (props: TdHTMLAttributes<HTMLTableCellElement>) => <td {...props} />,
  };

  return (
    <>
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
