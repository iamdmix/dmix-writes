import { isValidElement, type ComponentProps, type ReactNode } from "react";
import { MermaidDiagram } from "@/components/mermaid-diagram";

export function MdxPre({ children, ...props }: ComponentProps<"pre">) {
  if (
    isValidElement<{ className?: string; children?: ReactNode }>(children) &&
    children.props.className?.includes("language-mermaid")
  ) {
    return <MermaidDiagram chart={String(children.props.children).trim()} />;
  }
  return <pre {...props}>{children}</pre>;
}
