import { ImageResponse } from "next/og";

export const alt = "dmix writes — engineering notes by dmix";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
      <div style={{ display: "flex", fontSize: 27, color: "#c2410c" }}>// dmix writes</div>
      <div style={{ display: "flex", fontSize: 76, letterSpacing: "-4px", lineHeight: 1.05, maxWidth: "1000px" }}>
        Thoughts from the edge of the stack.
      </div>
      <div style={{ display: "flex", gap: 15, color: "#746a64", fontSize: 24 }}>
        systems · software · the odd sharp edge
      </div>
    </div>,
    size,
  );
}
