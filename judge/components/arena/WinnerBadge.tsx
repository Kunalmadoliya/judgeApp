"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface WinnerBadgeProps {
  winner: string;
}

export function WinnerBadge({ winner }: WinnerBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold shadow-sm",
        "bg-primary/10 border-primary/30 text-primary-foreground"
      )}
    >
      <Trophy className="h-4 w-4 text-primary" />
      <span className="capitalize text-primary tracking-tight">Winner: {winner}</span>
    </motion.div>
  );
}
