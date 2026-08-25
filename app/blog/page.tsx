import type { Metadata } from "next";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts, getAllTags } from "@/lib/posts";

export const metadata: Metadata = { title: "Archive", description: "Every engineering note published by dmix." };

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();
  return <><SiteHeader/><main className="shell page"><div className="eyebrow">Complete archive</div><h1 className="archive-title">All the notes,<br/>in one place.</h1><FilterablePostArchive posts={posts} tags={tags}/></main><SiteFooter/></>;
}
