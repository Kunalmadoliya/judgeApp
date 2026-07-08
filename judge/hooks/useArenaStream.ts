import { useState, useCallback } from 'react';

export type ArenaStatus = 'idle' | 'evaluating' | 'complete' | 'error';

export interface JudgeScore {
    accuracy: number;
    clarity: number;
    completeness: number;
}

export interface JudgeResult {
    winner: 'cerebras' | 'gemini' | 'groq';
    scores: {
        cerebras: JudgeScore;
        gemini: JudgeScore;
        groq: JudgeScore;
    };
    reason: string;
    finalAnswer: string;
}

export function useArena() {
    const [status, setStatus] = useState<ArenaStatus>('idle');
    const [prompt, setPrompt] = useState('');
    const [judgeResult, setJudgeResult] = useState<JudgeResult | null>(null);
    const [globalError, setGlobalError] = useState<string | null>(null);

    const submitPrompt = useCallback(async (newPrompt: string) => {
        if (!newPrompt.trim() || status === 'evaluating') return;

        setPrompt(newPrompt);
        setStatus('evaluating');
        setGlobalError(null);
        setJudgeResult(null);

        try {
            const res = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: newPrompt }),
            });

            if (!res.ok) throw new Error('Network response was not ok');

            const data = await res.json();
            
            if (data.success && data.response?.reply) {
                setJudgeResult(data.response.reply);
                setStatus('complete');
            } else {
                throw new Error(data.message || 'Invalid response from server');
            }
        } catch (error: unknown) {
            console.error('Submit Prompt Error:', error);
            setStatus('error');
            const errorMessage = error instanceof Error ? error.message : 'Failed to get a response.';
            setGlobalError(errorMessage);
        }
    }, [status]);

    return {
        status,
        prompt,
        judgeResult,
        globalError,
        submitPrompt,
    };
}
