import Link from "next/link";
import { HeartIcon } from "@/components/heart-icon";
import type { BlogPost } from "@/lib/posts";

export function Tag({ tag }: { tag: string }) { return <Link className="tag" href={`/topics/${encodeURIComponent(tag)}`}>#{tag}</Link>; }

export function PostList({ posts, topics = [], likeCounts = {} }: { posts: BlogPost[]; topics?: string[]; likeCounts?: Record<string, number> }) {
  const topicQuery = topics.length ? `?topics=${encodeURIComponent(topics.join(","))}` : "";
  return (
    <div className="post-list">
      {posts.map((post) => {
        const likes = likeCounts[post.slug] ?? 0;
        return (
          <article className="post-row" key={post.slug}>
            <div className="post-date metadata">{formatDate(post.date)}</div>
            <Link href={`/blog/${post.slug}${topicQuery}`}>
              <h3 className="post-title">{post.title}</h3>
              <p className="post-summary">{post.summary}</p>
            </Link>
            <div className="tag-set">
              {post.tags.map((tag) => (
                <Tag tag={tag} key={tag} />
              ))}
              {likes > 0 && (
                <span className="tag post-likes" title={`${likes} ${likes === 1 ? "like" : "likes"}`}>
                  <HeartIcon />
                  {likes}
                </span>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function formatDate(date: string) { return new Intl.DateTimeFormat("en", { month:"short", day:"2-digit", year:"numeric", timeZone:"UTC" }).format(new Date(`${date}T00:00:00Z`)); }
