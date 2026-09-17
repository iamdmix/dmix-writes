"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { PostList } from "@/components/post-list";
import type { BlogPost } from "@/lib/posts";

type Props = {
  posts: BlogPost[];
  tags: string[];
  initialTags?: string[];
  basePath?: string;
};

type SortOrder = "newest" | "most-liked";

export function FilterablePostArchive({ posts, tags, initialTags = [], basePath = "/blog" }: Props) {
  const router = useRouter();
  const skipInitialUrlSync = useRef(true);
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [tagsExpanded, setTagsExpanded] = useState(initialTags.length > 0);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let cancelled = false;
    fetch("/api/likes")
      .then((response) => (response.ok ? response.json() : {}))
      .then((counts: Record<string, number>) => {
        if (!cancelled && counts && typeof counts === "object") setLikeCounts(counts);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const visiblePosts = useMemo(() => {
    const filtered = selectedTags.length
      ? posts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag)))
      : posts;
    if (sortOrder === "most-liked") {
      return [...filtered].sort(
        (a, b) => (likeCounts[b.slug] ?? 0) - (likeCounts[a.slug] ?? 0) || b.date.localeCompare(a.date),
      );
    }
    return filtered;
  }, [posts, selectedTags, sortOrder, likeCounts]);

  const serializedInitialTags = initialTags.join(",");
  useEffect(() => {
    setSelectedTags(initialTags);
    setTagsExpanded(initialTags.length > 0);
  }, [serializedInitialTags]);

  useEffect(() => {
    if (skipInitialUrlSync.current) {
      skipInitialUrlSync.current = false;
      return;
    }
    const nextTopics = selectedTags.join(",");
    const currentTopics = new URLSearchParams(window.location.search).get("topics") ?? "";
    if (window.location.pathname === basePath && currentTopics === nextTopics) return;
    const query = nextTopics ? `?topics=${encodeURIComponent(nextTopics)}` : "";
    router.replace(`${basePath}${query}`, { scroll: false });
  }, [basePath, router, selectedTags]);

  function toggle(tag: string) {
    setSelectedTags((current) => (current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]));
  }

  return (
    <>
      <section className="tags-block" aria-label="Filter posts by topic">
        <span className="metadata">topics /</span>
        <div className={`tag-set collapsible-tags ${tagsExpanded || selectedTags.length ? "is-expanded" : ""}`}>
          {tags.map((tag) => (
            <button
              className="tag tag-button"
              type="button"
              aria-pressed={selectedTags.includes(tag)}
              onClick={() => toggle(tag)}
              key={tag}
            >
              #{tag}
            </button>
          ))}
        </div>
        <button
          className="toggle-tags metadata"
          type="button"
          aria-expanded={tagsExpanded || selectedTags.length > 0}
          onClick={() => setTagsExpanded((expanded) => !expanded)}
        >
          {tagsExpanded || selectedTags.length ? "show less" : `show all ${tags.length} topics`}
        </button>
      </section>
      <section>
        <div className="archive-head">
          <h2>
            {selectedTags.length
              ? `${visiblePosts.length} matching note${visiblePosts.length === 1 ? "" : "s"}`
              : "Writing"}
          </h2>
          <div className="archive-controls">
            <div className="sort-toggle metadata" role="group" aria-label="Sort posts">
              <button
                className={sortOrder === "newest" ? "is-active" : ""}
                type="button"
                aria-pressed={sortOrder === "newest"}
                onClick={() => setSortOrder("newest")}
              >
                newest
              </button>
              <span aria-hidden="true">/</span>
              <button
                className={sortOrder === "most-liked" ? "is-active" : ""}
                type="button"
                aria-pressed={sortOrder === "most-liked"}
                onClick={() => setSortOrder("most-liked")}
              >
                most liked
              </button>
            </div>
            {selectedTags.length > 0 && (
              <button className="clear-topics metadata" type="button" onClick={() => setSelectedTags([])}>
                clear topics
              </button>
            )}
          </div>
        </div>
        {visiblePosts.length ? (
          <PostList posts={visiblePosts} topics={selectedTags} likeCounts={likeCounts} />
        ) : (
          <p className="empty-notes">No notes match that combination yet.</p>
        )}
      </section>
    </>
  );
}
