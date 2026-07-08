# Project Audit

## Current Architecture
The project uses the Next.js App Router. It is an AI Arena application that streams responses from three different AI models (Cerebras, Gemini, Groq) concurrently via Server-Sent Events (SSE). The architecture splits logic into frontend components/hooks, a monolithic backend API route (`/api/ai`), and isolated AI SDK wrappers in the `lib` folder. The final response is judged using OpenAI's structured outputs.

## Folder Structure
- `app/`: Next.js App Router (currently contains an empty `page.tsx` and standard layout files).
- `app/api/ai/`: Contains `route.ts`, the unified endpoint orchestrating streams.
- `components/arena/`: Domain-specific frontend UI components.
- `components/ui/`: Shadcn UI primitives.
- `docs/`: Audits and plans.
- `hooks/`: Contains `useArenaStream.ts` (React state and SSE handling).
- `lib/`: SDK wrappers for Cerebras, Gemini, Groq, OpenAI, and shared utilities.

## Data Flow
User input -> `submitPrompt` (`useArenaStream`) -> POST `/api/ai` -> Concurrently fetches streams from `lib/` SDKs -> Backend sends SSE `data:` events -> `useArenaStream` parses events -> State updates -> React re-renders `components/arena/` with streaming text -> Backend finishes -> Backend requests OpenAI Judge -> Judge result pushed via SSE -> UI updates winner.

## API Flow
1. POST `/api/ai` with JSON `{ message }`.
2. Creates `ReadableStream` and dispatches concurrent `Promise.all` for model generators.
3. Generator yields chunks -> API sends `provider_chunk` events.
4. On completion -> API sends `provider_status` (complete).
5. All completed -> API calls `evalOpenai`.
6. API sends `judge_status` and `judge_result`.

## Existing Coding Style
- Simple functional programming style.
- Uses `export async function` or `export async function*` for services.
- Avoids classes.
- Uses basic `for await...of` to consume API streams.
- Relies heavily on React hooks (`useState`, `useCallback`) for the frontend.
- Uses Zod for OpenAI structured outputs.

## Existing Components
- `Header.tsx`, `ChatInput.tsx`, `EmptyState.tsx`, `FinalAnswerCard.tsx`, `JudgeCard.tsx`, `MarkdownRenderer.tsx`, `PromptCard.tsx`, `ProviderCard.tsx`, `ProviderGrid.tsx`, `StreamingCursor.tsx`.

## Existing Utilities
- `utils.ts` (contains `cn` for Tailwind class merging).
- `systemPrompt.ts` (contains the shared string prompt for models).

## Existing Hooks
- `useArenaStream.ts` (orchestrates all state related to the SSE request).

## Reusable Code
- The UI primitives in `components/ui` and the `cn` utility.

## Duplicate Code
- Minimal duplication. Model wrappers (`askGemini`, `askGroq`) share similar loops but must use different SDKs, so abstraction isn't strictly necessary.

## Dead Code
- `components/arena/*` and `hooks/useArenaStream.ts` are currently dead code because they are unreferenced due to `app/page.tsx` being empty.

## Performance Issues
- Using `JSON.parse` iteratively on streaming chunks in the client hook. While generally fine, it can block the main thread if chunk frequency is extremely high.
- A missing `handleStreamEvent` dependency in `useCallback` in the hook could lead to stale closures if not fixed.

## Accessibility Issues
- Assuming `app/page.tsx` renders the arena components, generic accessibility applies. Inputs and buttons should maintain basic ARIA attributes.

## Security Issues
- Environment variables (`process.env.*`) are correctly accessed only in backend scripts.

## Components that must NOT change
- `lib/gemini/index.ts`
- `lib/groq/groq.ts`
- `lib/openai/openai.ts`
- `lib/systemPrompt.ts`

## Components that require fixing
- `app/page.tsx`
- `lib/cerebras/index.ts`
- `hooks/useArenaStream.ts`
- `app/api/ai/route.ts` (Type fixes)
- `app/layout.tsx` (Theme layout restoration)

## Safe refactoring opportunities
- Hoist `handleStreamEvent` above `submitPrompt` in `useArenaStream.ts`.
- Replace explicit `any` in `catch (error: any)` blocks with `unknown` if it doesn't hurt readability, or simply leave as `any` if keeping it simple as per instructions.
