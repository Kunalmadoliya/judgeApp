"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  if (!error) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-2xl mx-auto mt-8 flex flex-col items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/10 p-6 text-center shadow-sm"
    >
      <AlertTriangle className="mb-3 h-8 w-8 text-destructive" />
      <h3 className="mb-1 text-lg font-semibold text-destructive">Something went wrong</h3>
      <p className="text-sm text-destructive/80">{error}</p>
    </motion.div>
  );
}
