"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Scale, CheckCircle2, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";
import { JudgeResult } from "@/hooks/useArenaStream";
import { WinnerBadge } from "./WinnerBadge";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CopyButton } from "./CopyButton";

interface JudgePanelProps {
  result: JudgeResult;
}

const PHASES = [
  { id: 0, text: "Analyzing model responses...", delay: 0 },
  { id: 1, text: "Synthesizing best answer...", delay: 1500 },
  { id: 2, text: "Generating final verdict...", delay: 3000 },
  { id: 3, text: "Completed", delay: 4500 }
];

export function JudgePanel({ result }: JudgePanelProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeouts = PHASES.map((p) => 
      setTimeout(() => setPhase(p.id), p.delay)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  const isComplete = phase === 3;

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col gap-6"
    >
      {/* Hero AI Judge Card */}
      <motion.div 
        layout
        className="relative w-full rounded-[24px] bg-card border border-border shadow-xl overflow-hidden p-8 md:p-10"
      >
        {/* Glass Highlight Sweep */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] -translate-x-[150%] pointer-events-none"
          animate={{ translateX: ["-150%", "50%"] }}
          transition={{ duration: 3, ease: "easeInOut", repeat: isComplete ? 0 : Infinity, repeatDelay: 1 }}
        />

        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative z-10 border-b border-border/50 pb-8">
          <div className="flex items-center gap-4">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
              <BrainCircuit className="h-8 w-8 text-primary" />
              {!isComplete && (
                <motion.div 
                  className="absolute inset-0 rounded-2xl border border-primary/40"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold tracking-tight text-foreground font-serif">OpenAI Judge</h2>
              <div className="flex items-center gap-2 mt-1">
                {!isComplete ? (
                  <motion.div 
                    key={phase}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-medium text-primary flex items-center gap-1.5"
                  >
                    <div className="flex gap-0.5">
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2 }} className="h-1 w-1 bg-primary rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="h-1 w-1 bg-primary rounded-full" />
                      <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="h-1 w-1 bg-primary rounded-full" />
                    </div>
                    {PHASES[phase].text}
                  </motion.div>
                ) : (
                  <span className="text-sm font-medium text-green-500 flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" /> Completed
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Winner Badge Reveals */}
          <AnimatePresence>
            {isComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                className="flex flex-col items-end gap-2"
              >
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">Match Champion</span>
                <div className="scale-125 origin-right">
                  <WinnerBadge winner={result.winner} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Reasoning Reveal */}
        <AnimatePresence>
          {isComplete && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
              className="pt-8 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-4">
                <Scale className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold tracking-tight text-foreground">Judge's Verdict</h3>
              </div>
              <p className="text-lg leading-relaxed text-muted-foreground font-serif italic border-l-2 border-primary/30 pl-6">
                "{result.reason}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Final Synthesized Answer Reveal */}
      <AnimatePresence>
        {isComplete && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1, ease: "easeOut" }}
            className="w-full rounded-[24px] bg-card border border-border shadow-lg p-8 md:p-12 relative overflow-hidden group"
          >
            <div className="absolute top-8 right-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <CopyButton text={result.finalAnswer} className="h-10 w-10 bg-muted hover:bg-muted/80 border border-border rounded-xl" />
            </div>
            
            <div className="flex items-center gap-3 mb-8 border-b border-border/50 pb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-foreground text-background shadow-md">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-foreground">Synthesized Answer</h3>
                <p className="text-sm text-muted-foreground mt-1">Best elements combined by OpenAI</p>
              </div>
            </div>
            
            <div className="prose prose-lg prose-invert max-w-none custom-scrollbar">
              <MarkdownRenderer content={result.finalAnswer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
