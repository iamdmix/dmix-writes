import type { MetadataRoute } from "next";

const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog/docker-for-dummies`,
      lastModified: new Date("2026-08-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/vms-vs-containers`,
      lastModified: new Date("2026-08-25"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/docker-production-builds`,
      lastModified: new Date("2026-08-27"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/docker-for-dummies-part-2`,
      lastModified: new Date("2026-08-29"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/docker-engine-under-the-hood`,
      lastModified: new Date("2026-08-31"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/ricing-macos`,
      lastModified: new Date("2026-09-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
