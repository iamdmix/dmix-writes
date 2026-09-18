import type { MetadataRoute } from "next";
import { getAllPosts, getAllTags, postLastModifiedDate } from "@/lib/posts";
import { siteUrl as baseUrl } from "@/lib/site";

function toDate(dateString: string): Date {
  return new Date(`${dateString}T00:00:00Z`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const latestModification = posts
    .map((post) => postLastModifiedDate(post))
    .sort((a, b) => b.localeCompare(a))[0];
  const latestDate = latestModification ? toDate(latestModification) : new Date();

  return [
    {
      url: baseUrl,
      lastModified: latestDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: toDate(postLastModifiedDate(post)),
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
