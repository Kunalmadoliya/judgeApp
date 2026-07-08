# Code Audit

## Current Architecture
The project follows a Next.js App Router architecture. 
The backend handles concurrent streaming from three LLM providers (Cerebras, Gemini, Groq) via a single API route (`app/api/ai/route.ts`). It uses Server-Sent Events (SSE) to push chunks to the client. After streaming completes, it calls an OpenAI evaluator to judge the responses using structured outputs (Zod schema).
The frontend uses a custom React hook (`hooks/useArenaStream.ts`) to manage the complex SSE lifecycle, parse chunks, and maintain the state for all providers and the judge.
The UI relies on Shadcn primitives, Framer Motion, and Tailwind CSS. 

## Existing Coding Style
* Uses functional programming and React hooks (`useCallback`, `useState`). Does not use classes.
* Simple module exports for AI wrappers (`export async function* askGroq`).
* Uses Zod for schema validation.
* Explicit typing for state objects but occasionally uses `any` for error handling and chunk parsing.
* Follows a standard Next.js directory structure (`app/`, `components/`, `lib/`, `hooks/`).
* Prefers modular, single-responsibility files for AI integrations in `lib/`.

## Folder Structure
* `app/`: Next.js routing (currently contains an empty `page.tsx` and a default `layout.tsx`).
* `app/api/ai/`: Contains the monolithic SSE API route.
* `components/arena/`: UI components for the dashboard (cards, chat input).
* `components/ui/`: Shadcn UI primitives.
* `hooks/`: Contains the `useArenaStream.ts` hook.
* `lib/`: AI provider integrations (Cerebras, Gemini, Groq, OpenAI) and utility functions (`utils.ts`, `systemPrompt.ts`).

## Reusable Code
* `lib/utils.ts` (`cn` utility for Tailwind classes).
* UI Primitives in `components/ui/`.
* MarkdownRenderer and shared Cards in `components/arena/`.

## Duplicate Code
* Error handling in `app/api/ai/route.ts` is mostly abstracted by `handleProviderStream`, minimizing duplication.
* The structure for AI provider wrapper functions (`askGemini`, `askGroq`) is repetitive but necessary due to different SDKs.

## Dead Code
* With `app/page.tsx` being empty, all components in `components/arena/` and `hooks/useArenaStream.ts` are currently dead code (unused).

## Build Errors
* `lib/cerebras/index.ts:29:13` - `Expression expected`. The `yield` keyword is used inside a regular `async function` instead of an `async function*` (generator).

## Runtime Errors
* `app/page.tsx` is completely empty. Next.js requires the default export of a React component to render a page, resulting in a severe runtime/rendering crash.

## TypeScript Errors
* `app/page.tsx` will fail type checking implicitly because it exports nothing.
* `lib/cerebras/index.ts` has a syntax error due to `yield` inside a non-generator function.
* Assorted implicit `any` types throughout the codebase.

## ESLint Issues
* `hooks/useArenaStream.ts:89`: `handleStreamEvent` is accessed before it is declared.
* `hooks/useArenaStream.ts`: Missing `handleStreamEvent` in the `useCallback` dependency array.
* Multiple `Unexpected any` warnings in `app/api/ai/route.ts` and `hooks/useArenaStream.ts`.
* Unused variables: `e` in `hooks/useArenaStream.ts`, `log` in `lib/cerebras/index.ts`.

## Import/Export Issues
* `app/page.tsx` is missing all imports and its default export.
* `lib/cerebras/index.ts` imports `log` from `console` unnecessarily.

## Performance Issues
* The backend API concurrent stream handles multiple connections well, but `JSON.parse` is run sequentially per SSE line in the hook, which could bottleneck if chunks arrive at extremely high volume, though acceptable for this scale.

## Components That Should NOT Be Changed
* `lib/gemini/index.ts`
* `lib/groq/groq.ts`
* `lib/openai/openai.ts`
* The SSE implementation in `app/api/ai/route.ts` (except for fixing strict types if necessary).
* `lib/systemPrompt.ts`

## Components That Need Fixing
* `app/page.tsx` (Needs to be restored to implement the UI layout).
* `lib/cerebras/index.ts` (Needs generator `*` restored and `console.log` import removed).
* `hooks/useArenaStream.ts` (Needs hoisting of `handleStreamEvent` and strict types).
* `app/layout.tsx` (Needs proper styling restored for the dark theme to take effect correctly with Shadcn and the Arena layout).

## Safe Refactoring Opportunities
* Replace `any` types in `catch (error: any)` with `unknown` and proper type narrowing.
* Hoist the `handleStreamEvent` function above `submitPrompt` in the hook.
