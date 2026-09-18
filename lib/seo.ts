import { postDateIso } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export const siteName = "dmix writes";
export const siteDescription =
  "Engineering notes by dmix — systems, software, and the odd sharp edge.";
export const siteLanguage = "en";

export const author = {
  name: "Dharmik Shinde",
  alternateName: "dmix",
  url: siteUrl,
  sameAs: ["https://dharmikshinde.tech", "https://github.com/iamdmix"],
};

function personRef() {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: author.name,
    url: siteUrl,
    sameAs: author.sameAs,
  };
}

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${siteUrl}/#person`,
    name: author.name,
    alternateName: author.alternateName,
    url: siteUrl,
    sameAs: author.sameAs,
    description: "Engineer writing about systems, containers, and macOS setups.",
    knowsAbout: ["Docker", "Linux", "macOS", "DevOps", "software engineering"],
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: siteLanguage,
    publisher: { "@id": `${siteUrl}/#person` },
  };
}

export function blogJsonLd(postUrls: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}/#blog`,
    name: siteName,
    url: siteUrl,
    description: siteDescription,
    inLanguage: siteLanguage,
    author: { "@id": `${siteUrl}/#person` },
    blogPost: postUrls.map((url) => ({
      "@type": "BlogPosting",
      "@id": url,
      url,
    })),
  };
}

export function profilePageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: `${siteName} — engineering notes by dmix`,
    description: siteDescription,
    inLanguage: siteLanguage,
    mainEntity: { "@id": `${siteUrl}/#person` },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

export function collectionJsonLd(name: string, path: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}${path}`,
    url: `${siteUrl}${path}`,
    name,
    description,
    inLanguage: siteLanguage,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#blog` },
  };
}

export function postJsonLd(post: {
  slug: string;
  title: string;
  summary: string;
  date: string;
  updated?: string;
  tags: string[];
  wordCount: number;
}) {
  const url = `${siteUrl}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": url,
    url,
    headline: post.title,
    description: post.summary,
    datePublished: postDateIso(post.date),
    dateModified: postDateIso(post.updated ?? post.date),
    inLanguage: siteLanguage,
    author: personRef(),
    publisher: personRef(),
    isPartOf: { "@id": `${siteUrl}/#blog` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    image: `${url}/opengraph-image`,
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
    timeRequired: `PT${Math.max(1, Math.ceil(post.wordCount / 220))}M`,
    commentCount: 0,
  };
}
