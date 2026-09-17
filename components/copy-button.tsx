"use client";

import { useState, type MouseEvent } from "react";

export function CopyButton() {
  const [copied, setCopied] = useState(false);

  async function copy(event: MouseEvent<HTMLButtonElement>) {
    const pre = event.currentTarget.closest(".code-block")?.querySelector("pre");
    if (!pre) return;
    const text = pre.innerText;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      document.body.removeChild(helper);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      className="copy-button"
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied to clipboard" : "Copy code to clipboard"}
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
