"use client";

import { motion } from "framer-motion";
import { CopyButton } from "./CopyButton";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface ProviderCardProps {
  name: string;
  provider: {
    status: "idle" | "streaming" | "complete" | "error";
    text: string;
    latency?: number;
    error?: string;
  };
}

export function ProviderCard({ name, provider }: ProviderCardProps) {
  const { status, text, latency, error } = provider;
  const isStreaming = status === "streaming";
  const isError = status === "error";
  const isComplete = status === "complete";
  const isIdle = status === "idle";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full min-h-[400px] rounded-2xl border border-border bg-card/50 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-5 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-foreground tracking-tight">{name}</h2>
          {isStreaming && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {isComplete && <CheckCircle2 className="h-4 w-4 text-green-500/80" />}
          {isError && <AlertCircle className="h-4 w-4 text-destructive" />}
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {latency ? <span>{(latency / 1000).toFixed(2)}s</span> : null}
          {text.length > 0 && (
            <span>
              {text.length} chars
            </span>
          )}
          {text && <CopyButton text={text} className="h-7 w-7 border-none bg-transparent hover:bg-muted" />}
        </div>
      </div>
      
      <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
        {isIdle && (
          <div className="flex h-full items-center justify-center text-muted-foreground/50 italic text-sm">
            Waiting for prompt...
          </div>
        )}
        
        {isError && (
          <div className="text-destructive text-sm rounded bg-destructive/10 p-4 border border-destructive/20">
            {error || "An unknown error occurred."}
          </div>
        )}

        {(isStreaming || isComplete) && (
          <div className="w-full">
            <MarkdownRenderer content={text} />
            {isStreaming && (
              <span className="inline-block h-4 w-2 bg-foreground/50 animate-pulse ml-1 align-middle" />
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
