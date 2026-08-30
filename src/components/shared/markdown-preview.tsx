"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

/**
 * Renders markdown content with prose styling.
 * Used for previewing markdown in the Knowledge page and script copy preview.
 */
export function MarkdownPreview({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "prose prose-sm max-w-none dark:prose-invert",
        "prose-headings:font-semibold prose-headings:tracking-tight",
        "prose-h1:text-lg prose-h1:border-b prose-h1:pb-1 prose-h1:border-border",
        "prose-h2:text-base prose-h2:mt-4",
        "prose-h3:text-sm prose-h3:mt-3",
        "prose-p:text-sm prose-p:leading-relaxed",
        "prose-li:text-sm prose-li:leading-relaxed",
        "prose-strong:font-semibold",
        "prose-code:text-xs prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded",
        "prose-code:before:content-none prose-code:after:content-none",
        "prose-ul:my-2 prose-ol:my-2",
        "prose-hr:border-border",
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
