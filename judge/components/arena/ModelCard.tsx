"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, Zap, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { EvaluationMetrics } from "./EvaluationMetrics";

export type SimulationState = 'queued' | 'running' | 'streaming' | 'completed';

interface ModelCardProps {
  provider: 'cerebras' | 'gemini' | 'groq';
  simulationState: SimulationState;
  scores?: { accuracy: number; clarity: number; completeness: number };
  className?: string;
}

const PROVIDER_INFO = {
  cerebras: { name: "Cerebras", icon: Brain, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  gemini: { name: "Gemini", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  groq: { name: "Groq", icon: Zap, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }
};

export function ModelCard({ provider, simulationState, scores, className }: ModelCardProps) {
  const info = PROVIDER_INFO[provider];
  const Icon = info.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative flex flex-col rounded-[24px] bg-card border overflow-hidden shadow-lg transition-all duration-500 p-6",
        simulationState === 'streaming' ? "border-primary/50 shadow-[0_0_30px_rgba(79,70,229,0.1)]" : "border-border",
        className
      )}
    >
      {/* Dynamic Animated Border Glow for Streaming */}
      {simulationState === 'streaming' && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent pointer-events-none"
          animate={{ x: ['-100%', '200%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-[16px] border", info.bg, info.border)}>
            <Icon className={cn("h-6 w-6", info.color)} />
          </div>
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">{info.name}</h3>
            <p className="text-sm text-muted-foreground">Evaluation Engine</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2">
          {simulationState === 'queued' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border">
              <Clock className="h-3.5 w-3.5" /> Queued
            </span>
          )}
          {simulationState === 'running' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500 border border-amber-500/20">
              <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" /> Running
            </span>
          )}
          {simulationState === 'streaming' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary border border-primary/20">
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Streaming
            </span>
          )}
          {simulationState === 'completed' && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-xs font-medium text-green-500 border border-green-500/20">
              <CheckCircle2 className="h-3.5 w-3.5" /> Completed
            </span>
          )}
        </div>
      </div>

      {/* Body Area */}
      <div className="flex-1 flex flex-col relative z-10 min-h-[140px]">
        {simulationState === 'queued' && (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-muted-foreground/40 font-mono text-sm uppercase tracking-widest">Waiting in Queue</span>
          </div>
        )}

        {(simulationState === 'running' || simulationState === 'streaming') && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {simulationState === 'running' ? 'Waking up model' : 'Generating response'}
              </span>
              <span className="flex gap-0.5">
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="h-1 w-1 bg-muted-foreground rounded-full" />
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="h-1 w-1 bg-muted-foreground rounded-full" />
                <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="h-1 w-1 bg-muted-foreground rounded-full" />
              </span>
            </div>
            {/* Skeleton Lines */}
            <div className="space-y-2 w-full">
              <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden relative">
                <motion.div className="absolute inset-y-0 left-0 bg-primary/20 w-1/3" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }} />
              </div>
              <div className="h-2 w-4/5 bg-muted/30 rounded-full overflow-hidden relative">
                <motion.div className="absolute inset-y-0 left-0 bg-primary/20 w-1/3" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: 0.2 }} />
              </div>
              <div className="h-2 w-3/5 bg-muted/30 rounded-full overflow-hidden relative">
                <motion.div className="absolute inset-y-0 left-0 bg-primary/20 w-1/3" animate={{ x: ['-100%', '300%'] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'linear', delay: 0.4 }} />
              </div>
            </div>
          </div>
        )}

        {simulationState === 'completed' && scores && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col justify-end"
          >
            <EvaluationMetrics scores={scores} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
