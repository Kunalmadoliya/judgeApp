"use client";

import { motion } from "framer-motion";

interface ScoreBarProps {
  label: string;
  score: number;
}

export function ScoreBar({ label, score }: ScoreBarProps) {
  // Score is 1-10
  const normalizedScore = Math.max(0, Math.min(10, Math.round(score)));
  const blocks = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="flex flex-col gap-2 w-full group">
      <div className="flex justify-between text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
        <span className="tracking-wide uppercase text-xs">{label}</span>
        <span className="text-foreground/90 font-mono text-xs">{normalizedScore}/10</span>
      </div>
      <div className="flex gap-1 h-3 w-full">
        {blocks.map((index) => {
          const isActive = index < normalizedScore;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ 
                duration: 0.4, 
                delay: 0.1 + index * 0.04, 
                ease: [0.16, 1, 0.3, 1] 
              }}
              className={`flex-1 rounded-sm border ${
                isActive 
                  ? "bg-primary border-primary/20 shadow-[0_0_8px_rgba(var(--color-primary),0.3)]" 
                  : "bg-muted/30 border-border/40"
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
