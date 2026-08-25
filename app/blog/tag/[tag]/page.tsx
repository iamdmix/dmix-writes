import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FilterablePostArchive } from "@/components/filterable-post-archive";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { getAllPosts, getAllTags, getPostsByTag } from "@/lib/posts";

type Props = { params: Promise<{ tag:string }> };
export function generateStaticParams() { return getAllTags().map((tag) => ({ tag })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const {tag}=await params; return { title:`#${tag}`, description:`Notes about ${tag} by dmix.` }; }
export default async function TagPage({ params }: Props) { const {tag}=await params; if (!getPostsByTag(tag).length) notFound(); return <><SiteHeader/><main className="shell page"><div className="eyebrow">Complete archive</div><h1 className="archive-title">All the notes,<br/>in one place.</h1><FilterablePostArchive posts={getAllPosts()} tags={getAllTags()} initialTags={[tag]}/></main><SiteFooter/></>; }
