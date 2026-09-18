import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const alt = "dmix writes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug);

  if (!post || post.draft) {
    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fdfbf7",
          color: "#241e1a",
          padding: "78px",
          borderTop: "16px solid #c2410c",
        }}
      >
        <div style={{ display: "flex", fontSize: 27, color: "#c2410c" }}>{"// dmix writes"}</div>
        <div style={{ display: "flex", fontSize: 72, letterSpacing: "-4px", lineHeight: 1.05 }}>
          dmix writes
        </div>
        <div style={{ display: "flex", gap: 15, color: "#746a64", fontSize: 24 }}>
          engineering notes
        </div>
      </div>,
      size,
    );
  }

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#fdfbf7",
        color: "#241e1a",
        padding: "78px",
        borderTop: "16px solid #c2410c",
      }}
    >
      <div style={{ display: "flex", fontSize: 27, color: "#c2410c" }}>{"// dmix writes"}</div>
      <div style={{ display: "flex", fontSize: 72, letterSpacing: "-4px", lineHeight: 1.05, maxWidth: "1000px" }}>
        {post.title}
      </div>
      <div style={{ display: "flex", gap: 15, color: "#746a64", fontSize: 24 }}>
        {post.tags.map((tag) => `#${tag}`).join("   ")}
      </div>
    </div>,
    size,
  );
}
