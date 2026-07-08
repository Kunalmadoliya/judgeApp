"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Settings2, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PromptComposerProps {
  onSend: (prompt: string) => void;
  disabled: boolean;
}

export function PromptComposer({ onSend, disabled }: PromptComposerProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "relative flex flex-col w-full rounded-[24px] bg-card border transition-all duration-300 overflow-hidden",
          isFocused 
            ? "border-primary/50 shadow-[0_0_30px_rgba(79,70,229,0.1)] ring-1 ring-primary/20" 
            : "border-border shadow-lg hover:border-border/80"
        )}
      >
        <div className="flex-1 p-5 pb-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask anything..."
            rows={2}
            className="w-full resize-none bg-transparent text-[1.1rem] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none disabled:opacity-50 min-h-[60px] custom-scrollbar"
          />
        </div>
        
        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between px-5 pb-4 pt-2">
          <div className="flex items-center gap-1.5">
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-full hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-border/50">
              <Paperclip className="h-4 w-4" />
              Attach
            </button>
            <button type="button" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-full hover:bg-accent hover:text-foreground transition-colors border border-transparent hover:border-border/50">
              <Settings2 className="h-4 w-4" />
              Advanced
              <ChevronDown className="h-3 w-3 ml-0.5 opacity-50" />
            </button>
          </div>
          
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!input.trim() || disabled}
            className={cn(
              "relative group flex h-11 items-center justify-center gap-2 rounded-full px-6 font-semibold transition-all duration-300 overflow-hidden",
              input.trim() && !disabled 
                ? "bg-primary text-primary-foreground shadow-[0_4px_20px_-4px_rgba(79,70,229,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(79,70,229,0.6)] hover:-translate-y-0.5" 
                : "bg-muted text-muted-foreground cursor-not-allowed border border-border"
            )}
          >
            {input.trim() && !disabled && (
              <span className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            <Sparkles className={cn("h-4 w-4 relative z-10 transition-transform duration-300", input.trim() && !disabled && "group-hover:rotate-12 group-hover:scale-110")} />
            <span className="relative z-10 text-[15px]">Evaluate</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
