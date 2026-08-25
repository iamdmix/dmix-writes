import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
export const dynamic = "force-static";
export function GET() { const siteUrl=process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"; const feed=new Feed({ title:"dmix writes", description:"Engineering notes by dmix.", id:siteUrl, link:siteUrl, language:"en", copyright:`© ${new Date().getFullYear()} dmix` }); getAllPosts().forEach((post) => feed.addItem({ title:post.title, id:`${siteUrl}/blog/${post.slug}`, link:`${siteUrl}/blog/${post.slug}`, description:post.summary, date:new Date(`${post.date}T00:00:00Z`), category:post.tags.map((name)=>({ name })) })); return new Response(feed.rss2(), { headers:{ "Content-Type":"application/xml; charset=utf-8" } }); }
