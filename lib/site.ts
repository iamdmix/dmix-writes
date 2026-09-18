const productionSiteUrl = "https://blog.dharmikshinde.tech";

export const siteUrl = (process.env.SITE_URL?.trim() || productionSiteUrl).replace(/\/+$/, "");

export function absoluteUrl(path = "/"): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
