import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteUrl as baseUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0];

  return [
    {
      url: baseUrl,
      lastModified: latestPost ? new Date(`${latestPost.date}T00:00:00Z`) : new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
