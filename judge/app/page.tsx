"use client";

import { useState, useEffect } from "react";
import { useArena } from "@/hooks/useArenaStream";
import { PromptComposer } from "@/components/arena/PromptComposer";
import { EmptyState } from "@/components/arena/EmptyState";
import { ModelCard, SimulationState } from "@/components/arena/ModelCard";
import { JudgePanel } from "@/components/arena/JudgePanel";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const { status, prompt, judgeResult, globalError, submitPrompt } = useArena();
  
  const [cerebrasState, setCerebrasState] = useState<SimulationState>('idle' as any);
  const [geminiState, setGeminiState] = useState<SimulationState>('idle' as any);
  const [groqState, setGroqState] = useState<SimulationState>('idle' as any);

  // Orchestrate simulated live evaluation states
  useEffect(() => {
    if (status === 'evaluating') {
      setCerebrasState('queued');
      setGeminiState('queued');
      setGroqState('queued');

      // Groq is fastest
      const groqRun = setTimeout(() => setGroqState('running'), 200);
      const groqStream = setTimeout(() => setGroqState('streaming'), 800);

      // Cerebras is fast
      const cerRun = setTimeout(() => setCerebrasState('running'), 500);
      const cerStream = setTimeout(() => setCerebrasState('streaming'), 1200);

      // Gemini is slower to start
      const gemRun = setTimeout(() => setGeminiState('running'), 1500);
      const gemStream = setTimeout(() => setGeminiState('streaming'), 2500);

      return () => {
        clearTimeout(groqRun); clearTimeout(groqStream);
        clearTimeout(cerRun); clearTimeout(cerStream);
        clearTimeout(gemRun); clearTimeout(gemStream);
      };
    } else if (status === 'complete') {
      setCerebrasState('completed');
      setGeminiState('completed');
      setGroqState('completed');
    } else if (status === 'idle') {
      setCerebrasState('idle' as any);
      setGeminiState('idle' as any);
      setGroqState('idle' as any);
    }
  }, [status]);

  const handleSelectPrompt = (selectedPrompt: string) => {
    submitPrompt(selectedPrompt);
  };

  return (
    <div className="w-full flex flex-col pt-8 pb-24 px-6 md:px-10">
      
      {/* Header Area */}
      <motion.div 
        layout
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center text-center w-full max-w-3xl mx-auto mb-10"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-muted-foreground shadow-sm mb-6">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          Production Grade LLM Evaluation
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-4 text-foreground">
          Almost<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary bg-300% animate-gradient">Fiesta</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground/80 leading-relaxed font-light max-w-2xl">
          Compare multiple LLMs simultaneously and let an AI judge determine the most accurate response.
        </p>
      </motion.div>

      {/* Prompt Composer */}
      <motion.div layout className="relative z-20 w-full mb-12">
        <PromptComposer onSend={submitPrompt} disabled={status === 'evaluating'} />
        {globalError && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 mx-auto w-full max-w-2xl rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-destructive-foreground text-center shadow-sm"
          >
            {globalError}
          </motion.div>
        )}
      </motion.div>

      {/* Dynamic Content Area */}
      <div className="w-full relative z-10 flex flex-col items-center">
        <AnimatePresence mode="wait">
          
          {/* Empty State */}
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20, scale: 0.95, filter: "blur(10px)" }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <EmptyState onSelectPrompt={handleSelectPrompt} />
            </motion.div>
          )}

          {/* Active Evaluation / Completed State */}
          {(status === 'evaluating' || status === 'complete') && (
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, staggerChildren: 0.1 }}
              className="w-full max-w-6xl mx-auto flex flex-col gap-8"
            >
              {/* Models Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <ModelCard 
                  provider="cerebras" 
                  simulationState={cerebrasState} 
                  scores={judgeResult?.scores?.cerebras} 
                />
                <ModelCard 
                  provider="gemini" 
                  simulationState={geminiState} 
                  scores={judgeResult?.scores?.gemini} 
                />
                <ModelCard 
                  provider="groq" 
                  simulationState={groqState} 
                  scores={judgeResult?.scores?.groq} 
                />
              </div>

              {/* Judge Panel */}
              <AnimatePresence>
                {status === 'complete' && judgeResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <JudgePanel result={judgeResult} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
