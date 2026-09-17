"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "dmix-liked-posts";

function readLikedSlugs(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function LikeButton({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLiked(readLikedSlugs().includes(slug));
    let cancelled = false;
    fetch("/api/likes")
      .then((response) => (response.ok ? response.json() : {}))
      .then((counts: Record<string, number>) => {
        if (!cancelled) setCount(typeof counts[slug] === "number" ? counts[slug] : 0);
      })
      .catch(() => {
        if (!cancelled) setCount(0);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function like() {
    if (liked) return;
    setLiked(true);
    setCount((current) => (current ?? 0) + 1);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...readLikedSlugs(), slug]));
    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      if (response.ok) {
        const data = (await response.json()) as { count?: number };
        if (typeof data.count === "number") setCount(data.count);
      }
    } catch {
      // Keep the optimistic count; the server just didn't hear about it.
    }
  }

  return (
    <button
      className={`like-button${liked ? " is-liked" : ""}`}
      type="button"
      onClick={like}
      disabled={liked}
      aria-pressed={liked}
      title={liked ? "You liked this post" : "Like this post"}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      <span>{count === null ? "0" : count}</span>
      <span className="like-label">{liked ? "liked" : "like this post"}</span>
    </button>
  );
}
