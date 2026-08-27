import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import rehypePrettyCode from "rehype-pretty-code";
import { MdxPre } from "@/components/mdx-pre";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { formatDate, Tag } from "@/components/post-list";
import { getAllPosts, getPost } from "@/lib/posts";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return getAllPosts().map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const post=getPost((await params).slug); if (!post || post.draft) return {}; return { title:post.title, description:post.summary, openGraph:{ images:[`/blog/${post.slug}/opengraph-image`] } }; }
export default async function PostPage({ params }: Props) {
  const post = getPost((await params).slug);
  if (!post || post.draft) notFound();
  return <><SiteHeader/><main className="article"><header className="article-head"><div className="tag-set" style={{ justifyContent:"flex-start" }}>{post.tags.map((tag)=><Tag tag={tag} key={tag}/>)}</div><h1>{post.title}</h1><p className="article-summary">{post.summary}</p><div className="article-meta metadata">{formatDate(post.date)} · {readingTime(post.content)} min read</div></header><article className="prose"><MDXRemote source={post.content} components={{ pre:MdxPre }} options={{ mdxOptions:{ rehypePlugins:[[rehypePrettyCode,{ theme:"github-dark", keepBackground:false }]] } }}/></article><footer className="article-footer"><Link href="/">← back to the archive</Link></footer></main><SiteFooter/></>;
}
function readingTime(content: string) { return Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 220)); }
