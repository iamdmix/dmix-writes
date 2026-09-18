import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const contentDirectory = path.join(process.cwd(), "content/blog");
const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().date(),
  updated: z.string().date().optional(),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  draft: z.boolean().default(false),
});

export type BlogPost = z.infer<typeof frontmatterSchema> & { slug: string };
export type PostLastMod = { date: string; updated?: string };

export function postLastModifiedDate(post: PostLastMod): string {
  return post.updated ?? post.date;
}
export type BlogPostWithContent = BlogPost & { content: string };

function fileNames(): string[] {
  return fs.readdirSync(contentDirectory).filter((file) => file.endsWith(".mdx"));
}

function readPost(fileName: string): BlogPostWithContent {
  const source = fs.readFileSync(path.join(contentDirectory, fileName), "utf8");
  const { data, content } = matter(source);
  const parsed = frontmatterSchema.parse(data);
  return { ...parsed, slug: fileName.replace(/\.mdx$/, ""), content };
}

export function getAllPosts(): BlogPost[] {
  return fileNames()
    .map(readPost)
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({ content, ...post }) => post);
}

export function getPost(slug: string): BlogPostWithContent | undefined {
  const file = `${slug}.mdx`;
  return fileNames().includes(file) ? readPost(file) : undefined;
}

export function getAllTags(): string[] {
  return Array.from(new Set(getAllPosts().flatMap((post) => post.tags))).sort();
}

export function filterPostsByTags(posts: BlogPost[], tags: string[]): BlogPost[] {
  if (!tags.length) return posts;
  return posts.filter((post) => tags.some((tag) => post.tags.includes(tag)));
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  return getAllPosts()
    .filter((item) => item.slug !== post.slug)
    .map((item) => ({ post: item, score: item.tags.filter((tag) => post.tags.includes(tag)).length }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.post.date.localeCompare(a.post.date))
    .slice(0, limit)
    .map((entry) => entry.post);
}
