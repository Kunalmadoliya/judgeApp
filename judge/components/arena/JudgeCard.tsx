"use client";

import { motion } from "framer-motion";
import { WinnerBadge } from "./WinnerBadge";
import { ScoreBar } from "./ScoreBar";

interface JudgeScores {
  accuracy: number;
  clarity: number;
  completeness: number;
}

interface JudgeResult {
  winner: string;
  reason: string;
  scores: {
    cerebras: JudgeScores;
    gemini: JudgeScores;
    groq: JudgeScores;
  };
  finalAnswer: string;
}

interface JudgeCardProps {
  result: JudgeResult | null;
  status: "idle" | "streaming" | "evaluating" | "complete" | "error";
}

export function JudgeCard({ result, status }: JudgeCardProps) {
  if (status === "idle" || status === "streaming") return null;

  if (status === "evaluating") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-2xl border border-border bg-card/50 p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]"
      >
        <div className="relative flex h-16 w-16 items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-t-2 border-foreground animate-spin" />
          <span className="text-2xl">⚖️</span>
        </div>
        <h3 className="text-lg font-medium text-foreground tracking-tight animate-pulse">
          OpenAI is evaluating responses...
        </h3>
      </motion.div>
    );
  }

  if (!result) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full rounded-2xl border border-border bg-card/80 p-8 shadow-sm"
    >
      <div className="flex flex-col md:flex-row items-start justify-between gap-8">
        <div className="flex-1 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground tracking-tight flex items-center gap-3">
              OpenAI Judge <span className="text-muted-foreground text-sm font-normal">GPT-4o-mini</span>
            </h2>
            <WinnerBadge winner={result.winner} />
          </div>
          
          <div className="prose prose-invert">
            <p className="text-foreground/90 text-lg leading-relaxed italic border-l-2 border-muted pl-4 py-1">
              &quot;{result.reason}&quot;
            </p>
          </div>
        </div>

        <div className="w-full md:w-96 flex flex-col gap-6 p-6 rounded-xl bg-background/50 border border-border/50">
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Cerebras</h4>
            <div className="space-y-2">
              <ScoreBar label="Accuracy" score={result.scores.cerebras.accuracy} />
              <ScoreBar label="Clarity" score={result.scores.cerebras.clarity} />
              <ScoreBar label="Completeness" score={result.scores.cerebras.completeness} />
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Gemini</h4>
            <div className="space-y-2">
              <ScoreBar label="Accuracy" score={result.scores.gemini.accuracy} />
              <ScoreBar label="Clarity" score={result.scores.gemini.clarity} />
              <ScoreBar label="Completeness" score={result.scores.gemini.completeness} />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Groq</h4>
            <div className="space-y-2">
              <ScoreBar label="Accuracy" score={result.scores.groq.accuracy} />
              <ScoreBar label="Clarity" score={result.scores.groq.clarity} />
              <ScoreBar label="Completeness" score={result.scores.groq.completeness} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
