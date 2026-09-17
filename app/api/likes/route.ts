import { NextResponse } from "next/server";
import { addLike, getLikeCounts } from "@/lib/likes";
import { getPost } from "@/lib/posts";

export const dynamic = "force-dynamic";

const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const recentRequests = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const timestamps = (recentRequests.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (timestamps.length >= RATE_LIMIT) {
    recentRequests.set(key, timestamps);
    return true;
  }
  timestamps.push(now);
  recentRequests.set(key, timestamps);
  return false;
}

export async function GET() {
  const counts = await getLikeCounts();
  return NextResponse.json(counts, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const slug = typeof body?.slug === "string" ? body.slug : "";
  const post = slug ? getPost(slug) : undefined;
  if (!post || post.draft) {
    return NextResponse.json({ error: "Unknown post" }, { status: 400 });
  }

  const count = await addLike(slug);
  return NextResponse.json({ slug, count });
}
