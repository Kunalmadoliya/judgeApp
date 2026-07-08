"use client";

import { ProviderCard } from "./ProviderCard";

interface ProviderState {
  status: "idle" | "streaming" | "complete" | "error";
  text: string;
  latency?: number;
  error?: string;
}

interface ProviderGridProps {
  providers: {
    cerebras: ProviderState;
    gemini: ProviderState;
    groq: ProviderState;
  };
}

export function ProviderGrid({ providers }: ProviderGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ProviderCard name="Cerebras" provider={providers.cerebras} />
      <ProviderCard name="Gemini" provider={providers.gemini} />
      <ProviderCard name="Groq" provider={providers.groq} />
    </div>
  );
}
