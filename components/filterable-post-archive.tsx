"use client";

import { useEffect, useMemo, useState } from "react";
import { PostList } from "@/components/post-list";
import type { BlogPost } from "@/lib/posts";

type Props = { posts: BlogPost[]; tags: string[]; initialTags?: string[]; basePath?: string };

export function FilterablePostArchive({ posts, tags, initialTags = [], basePath = "/blog" }: Props) {
  const [selectedTags, setSelectedTags] = useState(initialTags);
  const [tagsExpanded, setTagsExpanded] = useState(initialTags.length > 0);
  const visiblePosts = useMemo(() => selectedTags.length ? posts.filter((post) => selectedTags.some((tag) => post.tags.includes(tag))) : posts, [posts, selectedTags]);

  const serializedInitialTags = initialTags.join(",");
  useEffect(() => {
    setSelectedTags(initialTags);
    setTagsExpanded(initialTags.length > 0);
  }, [serializedInitialTags]);

  useEffect(() => {
    const query = selectedTags.length ? `?topics=${encodeURIComponent(selectedTags.join(","))}` : "";
    window.history.replaceState(null, "", `${basePath}${query}`);
  }, [basePath, selectedTags]);

  function toggle(tag: string) { setSelectedTags((current) => current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]); }

  return <><section className="tags-block" aria-label="Filter posts by topic"><span className="metadata">topics /</span><div className={`tag-set collapsible-tags ${tagsExpanded || selectedTags.length ? "is-expanded" : ""}`}>{tags.map((tag) => <button className="tag tag-button" type="button" aria-pressed={selectedTags.includes(tag)} onClick={() => toggle(tag)} key={tag}>#{tag}</button>)}</div><button className="toggle-tags metadata" type="button" aria-expanded={tagsExpanded || selectedTags.length > 0} onClick={() => setTagsExpanded((expanded) => !expanded)}>{tagsExpanded || selectedTags.length ? "show less" : `show all ${tags.length} topics`}</button></section><section><div className="archive-head"><h2>{selectedTags.length ? `${visiblePosts.length} matching note${visiblePosts.length === 1 ? "" : "s"}` : "Writing"}</h2>{selectedTags.length ? <button className="clear-topics metadata" type="button" onClick={() => setSelectedTags([])}>clear topics</button> : <span className="archive-count metadata">newest first</span>}</div>{visiblePosts.length ? <PostList posts={visiblePosts} topics={selectedTags}/> : <p className="empty-notes">No notes match that combination yet.</p>}</section></>;
}
