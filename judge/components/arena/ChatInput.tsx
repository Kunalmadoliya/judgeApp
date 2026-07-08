"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface ChatInputProps {
  onSend: (prompt: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
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
    <form 
      onSubmit={handleSubmit}
      className={cn(
        "relative w-full max-w-4xl mx-auto flex items-center transition-all duration-300",
        isFocused ? "shadow-[0_0_0_2px_var(--color-primary)_inset,0_10px_40px_-10px_rgba(var(--color-primary),0.2)]" : "shadow-md hover:shadow-lg",
        "rounded-[24px] bg-card/80 backdrop-blur-xl border border-border"
      )}
    >
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground/60">
        <Sparkles className="h-5 w-5" />
      </div>
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Prompt the Arena... (e.g. 'Explain quantum computing in simple terms')"
        rows={1}
        className={cn(
          "w-full resize-none bg-transparent py-5 pl-14 pr-16 text-lg text-foreground placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50 min-h-[64px] flex items-center custom-scrollbar"
        )}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
        <AnimatePresence mode="popLayout">
          {input.trim() && !disabled && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 10 }}
              className="mr-3 text-xs font-medium text-muted-foreground/50 hidden sm:block tracking-wide uppercase"
            >
              Return ↵
            </motion.span>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => handleSubmit()}
          disabled={!input.trim() || disabled}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-[14px] transition-all duration-300 shadow-sm",
            input.trim() && !disabled 
              ? "bg-primary text-primary-foreground hover:scale-105 active:scale-95 hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)]" 
              : "bg-muted text-muted-foreground",
            disabled && input.trim() && "bg-muted text-primary"
          )}
        >
          {disabled && input.trim() ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-4 w-4 ml-0.5" />
          )}
        </button>
      </div>
    </form>
  );
}
