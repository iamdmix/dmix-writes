import Link from "next/link";
import type { BlogPost } from "@/lib/posts";

export function Tag({ tag }: { tag: string }) { return <Link className="tag" href={`/blog/tag/${tag}`}>#{tag}</Link>; }

export function PostList({ posts }: { posts: BlogPost[] }) {
  return <div className="post-list">{posts.map((post) => <article className="post-row" key={post.slug}><div className="post-date metadata">{formatDate(post.date)}</div><Link href={`/blog/${post.slug}`}><h3 className="post-title">{post.title}</h3><p className="post-summary">{post.summary}</p></Link><div className="tag-set">{post.tags.map((tag) => <Tag tag={tag} key={tag} />)}</div></article>)}</div>;
}

export function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month:"short", day:"2-digit", year:"numeric", timeZone:"UTC" }).format(new Date(`${date}T00:00:00Z`)); }
