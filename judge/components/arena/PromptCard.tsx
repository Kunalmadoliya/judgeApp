"use client";

import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

interface PromptCardProps {
  prompt: string;
}

export function PromptCard({ prompt }: PromptCardProps) {
  if (!prompt) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-border bg-background p-6 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div className="flex mt-1 h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
          <MessageSquare className="h-4 w-4" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground mb-1">Your Prompt</span>
          <p className="text-lg text-foreground font-medium leading-relaxed">
            {prompt}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
