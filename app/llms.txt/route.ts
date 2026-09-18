import { getAllPosts, getAllTags, postLastModifiedDate } from "@/lib/posts";
import { siteDescription, siteName } from "@/lib/seo";
import { siteUrl as baseUrl } from "@/lib/site";

export function GET() {
  const posts = getAllPosts();
  const tags = getAllTags();

  const lines: string[] = [
    `# ${siteName}`,
    "",
    `> ${siteDescription}`,
    "",
    `${siteName} is a personal engineering blog written by dmix. Every article is hand-written,`,
    "based on hands-on experience with systems, containers, and macOS tooling. Posts are stored as",
    "MDX in a Git repository and published statically, so URLs are stable and citations resolve.",
    "",
    "## Blog posts",
    "",
    ...posts.map((post) => {
      const modified = postLastModifiedDate(post);
      return `- [${post.title}](${baseUrl}/blog/${post.slug}): ${post.summary} (published ${post.date}, last modified ${modified})`;
    }),
    "",
    "## Topics",
    "",
    ...tags.map((tag) => `- [${tag}](${baseUrl}/topics/${encodeURIComponent(tag)})`),
    "",
    "## Feeds and metadata",
    "",
    `- [RSS feed](${baseUrl}/feed.xml): full-text RSS with every published post`,
    `- [Sitemap](${baseUrl}/sitemap.xml): XML sitemap of all posts and topic hubs`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
