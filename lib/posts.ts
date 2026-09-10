import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const contentDirectory = path.join(process.cwd(), "content/blog");
const frontmatterSchema = z.object({
  title: z.string().min(1),
  date: z.string().date(),
  summary: z.string().min(1),
  tags: z.array(z.string().min(1)).min(1),
  draft: z.boolean().default(false),
});

export type BlogPost = z.infer<typeof frontmatterSchema> & { slug: string };
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
