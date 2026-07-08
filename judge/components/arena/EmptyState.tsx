"use client";

import { motion } from "framer-motion";
import { Sparkles, MessageSquare, Clock, ArrowRight } from "lucide-react";

const SUGGESTED_PROMPTS = [
  "Explain Kubernetes architecture",
  "Optimize React performance",
  "System Design for a chat app",
  "Debug this Python code",
  "Write complex SQL join",
  "Generate REST API specs"
];

const RECENT_PROMPTS = [
  "How does OKLCH color space work?",
  "Write a Next.js middleware for auth"
];

interface EmptyStateProps {
  onSelectPrompt: (prompt: string) => void;
}

export function EmptyState({ onSelectPrompt }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center w-full max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-[24px] bg-card border border-border shadow-2xl">
          <div className="absolute inset-0 rounded-[24px] bg-gradient-to-br from-primary/20 to-transparent opacity-50" />
          <Sparkles className="h-8 w-8 text-primary relative z-10" />
          <div className="absolute -bottom-2 -right-2 h-16 w-16 bg-primary/10 blur-xl rounded-full" />
        </div>
        
        <h2 className="mb-3 text-3xl font-semibold tracking-tight text-foreground font-sans">
          How can I help you today?
        </h2>
        <p className="max-w-md text-lg text-muted-foreground leading-relaxed font-light mb-12">
          Evaluate multiple LLMs simultaneously and let the AI Judge determine the most accurate response.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full text-left">
        {/* Suggested Prompts */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest pl-2">
            <MessageSquare className="h-4 w-4" />
            Suggested
          </div>
          <div className="flex flex-col gap-2">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                className="group flex items-center justify-between p-4 rounded-[16px] bg-card border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 text-left"
              >
                <span className="text-foreground/90 font-medium group-hover:text-foreground">{prompt}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Prompts */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-4"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground uppercase tracking-widest pl-2">
            <Clock className="h-4 w-4" />
            Recent History
          </div>
          <div className="flex flex-col gap-2">
            {RECENT_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => onSelectPrompt(prompt)}
                className="group flex items-center justify-between p-4 rounded-[16px] bg-card border border-border/50 hover:border-primary/30 hover:bg-accent/50 transition-all duration-300 text-left"
              >
                <span className="text-foreground/80 font-medium group-hover:text-foreground line-clamp-1">{prompt}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
