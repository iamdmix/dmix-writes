"use client";

import { useEffect, useId, useState } from "react";

let mermaidInitialized = false;

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function MermaidDiagram({ chart }: { chart: string }) {
  const id = useId().replace(/:/g, "");
  const [svg, setSvg] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              primaryColor: "#f3efea",
              primaryTextColor: "#241e1a",
              primaryBorderColor: "#c2410c",
              lineColor: "#746a64",
              secondaryColor: "#fdfbf7",
              tertiaryColor: "#f3efea",
              fontFamily: "Arial",
            },
          });
          mermaidInitialized = true;
        }
        const result = await mermaid.render(`diagram-${id}`, chart);
        if (!cancelled) setSvg(result.svg);
      } catch {
        if (!cancelled) setSvg(`<pre>${escapeHtml(chart)}</pre>`);
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <div
      className="mermaid"
      aria-label="Diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
