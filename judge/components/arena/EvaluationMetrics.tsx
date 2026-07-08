"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreMetricsProps {
  scores: {
    accuracy: number;
    clarity: number;
    completeness: number;
  };
}

function AnimatedBar({ label, targetScore, delay }: { label: string, targetScore: number, delay: number }) {
  const [isDone, setIsDone] = useState(false);
  
  // Normalize score out of 10
  const normalizedScore = Math.max(0, Math.min(10, Math.round(targetScore * 10) / 10));
  const percentage = (normalizedScore / 10) * 100;
  
  const count = useMotionValue(0);
  const displayCount = useTransform(count, (latest) => latest.toFixed(1));

  useEffect(() => {
    const controls = animate(count, normalizedScore, {
      duration: 1.5,
      delay: delay,
      ease: [0.16, 1, 0.3, 1],
      onComplete: () => setIsDone(true)
    });
    return controls.stop;
  }, [count, normalizedScore, delay]);

  return (
    <div className="flex flex-col gap-2 w-full group relative">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-muted-foreground uppercase tracking-wider text-[11px] group-hover:text-foreground transition-colors">
          {label}
        </span>
        <div className="flex items-center gap-1.5 text-foreground font-mono font-medium relative">
          <motion.span>{displayCount}</motion.span>
          <span className="text-muted-foreground/50 text-xs">/10</span>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -45 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              className="absolute -right-5 text-primary"
            >
              <Sparkles className="h-3 w-3" />
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden border border-border/40 relative">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, delay: delay, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "h-full rounded-full relative",
            normalizedScore > 8 ? "bg-green-500" : normalizedScore > 5 ? "bg-amber-500" : "bg-destructive"
          )}
        >
          {/* Shimmer effect inside the bar */}
          <motion.div 
            className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          />
        </motion.div>
      </div>
    </div>
  );
}

export function EvaluationMetrics({ scores }: ScoreMetricsProps) {
  return (
    <div className="flex flex-col gap-4 w-full mt-4 pt-4 border-t border-border/40">
      <AnimatedBar label="Accuracy" targetScore={scores.accuracy} delay={0.1} />
      <AnimatedBar label="Reasoning" targetScore={scores.clarity} delay={0.3} />
      <AnimatedBar label="Completeness" targetScore={scores.completeness} delay={0.5} />
    </div>
  );
}
