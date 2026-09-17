const fallbackSiteUrl = "http://localhost:3000";

export const siteUrl = (process.env.SITE_URL?.trim() || fallbackSiteUrl).replace(/\/+$/, "");
