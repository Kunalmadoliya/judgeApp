"use client";

import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) return null;

  return (
    <div className={cn("prose prose-invert max-w-none w-full", className)}>
      <ReactMarkdown
        components={{
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <div className="relative mt-4 mb-4 rounded-md border border-border bg-black/50 overflow-hidden">
                <div className="flex h-8 w-full items-center justify-between bg-zinc-900/50 px-4 text-xs text-muted-foreground border-b border-border/50">
                  <span>{match[1]}</span>
                </div>
                <SyntaxHighlighter
                  {...props}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  style={vscDarkPlus as any}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    background: "transparent",
                    padding: "1rem",
                  }}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded-sm text-sm text-foreground/90 font-mono" {...props}>
                {children}
              </code>
            );
          },
          p: ({ children }) => <p className="mb-4 text-foreground/90 leading-relaxed last:mb-0">{children}</p>,
          a: ({ children, href }) => <a href={href} className="text-primary hover:underline" target="_blank" rel="noreferrer">{children}</a>,
          ul: ({ children }) => <ul className="mb-4 list-disc pl-6 text-foreground/90 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="mb-4 list-decimal pl-6 text-foreground/90 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
          h1: ({ children }) => <h1 className="mb-4 mt-6 text-2xl font-bold tracking-tight text-foreground">{children}</h1>,
          h2: ({ children }) => <h2 className="mb-4 mt-6 text-xl font-semibold tracking-tight text-foreground">{children}</h2>,
          h3: ({ children }) => <h3 className="mb-3 mt-5 text-lg font-medium text-foreground">{children}</h3>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});
