import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { siteUrl as baseUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestPost = posts[0];
  const latestDate = latestPost ? new Date(`${latestPost.date}T00:00:00Z`) : new Date();

  return [
    {
      url: baseUrl,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(`${post.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...getAllTags().map((tag) => ({
      url: `${baseUrl}/topics/${encodeURIComponent(tag)}`,
      lastModified: latestDate,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
