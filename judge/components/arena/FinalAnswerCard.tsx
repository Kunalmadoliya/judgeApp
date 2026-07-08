"use client";

import { motion } from "framer-motion";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CopyButton } from "./CopyButton";
import { Sparkles } from "lucide-react";

interface FinalAnswerCardProps {
  answer?: string;
  status: "idle" | "streaming" | "evaluating" | "complete" | "error";
}

export function FinalAnswerCard({ answer, status }: FinalAnswerCardProps) {
  if (status !== "complete" || !answer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="w-full rounded-2xl border border-border bg-card shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 bg-background/50 px-6 py-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-foreground" />
          <h2 className="text-lg font-semibold text-foreground tracking-tight">Final Synthesized Answer</h2>
        </div>
        <CopyButton text={answer} />
      </div>
      <div className="p-8">
        <MarkdownRenderer content={answer} className="text-lg" />
      </div>
    </motion.div>
  );
}
