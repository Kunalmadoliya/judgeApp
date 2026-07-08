# UI Audit

## Current Architecture
- Framework: Next.js 16.2.10 (App Router)
- Language: TypeScript
- Styling: TailwindCSS v4
- Backend: A single monolithic API endpoint (`/api/ai`) that executes `Promise.all` for all providers and then calls OpenAI for evaluation. It returns a single JSON object.

## Folder Structure (Current)
- `app/` (page.tsx, layout.tsx, globals.css, api/ai/route.ts)
- `lib/` (cerebras/, gemini/, groq/, openai/, systemPrompt.ts)

## Existing Components
- Default Next.js template in `app/page.tsx`
- No reusable UI components exist yet.

## Existing Design System
- Standard Next.js boilerplate.
- Light/Dark mode toggling.
- Geist font.

## API Flow
1. Client POSTs to `/api/ai`
2. Server triggers Cerebras, Gemini, Groq via `Promise.all`.
3. Server waits for all.
4. Server evaluates responses using OpenAI.
5. Server sends a single JSON blob.

## Data Flow
Monolithic request-response cycle. The client sends a message and blocks until the entire process (generation + evaluation) completes.

## Current Problems
1. **No Streaming:** The current API blocks until all models and the judge finish. The UI cannot show progressive updates.
2. **Missing UI Libraries:** Shadcn, Framer Motion, and Lucide React are not installed.
3. **No Design System:** The design does not match the requested "Premium Dark Mode AI Arena" aesthetic.

## Components that can be reused
- None

## Components that should be deleted
- `app/page.tsx` contents
- `app/globals.css` default styles

## Components that should be redesigned
- Everything on the frontend.
- **Backend Refactor:** `/api/ai` must be converted from a static JSON response to a `ReadableStream` (Server-Sent Events) that emits progressive updates for `cerebras`, `gemini`, `groq`, and the final `judge` evaluation.

## Suggested Architecture
- **Frontend:** Next.js App Router (Client Components for stateful UI).
- **Backend:** A **single API endpoint** (`/api/ai`) using Next.js route handlers returning a `ReadableStream`. The stream will emit chunked JSON events as each model generates tokens, and a final event when the judge completes.

## Suggested Folder Structure
```text
app/
  api/ai/route.ts
components/
  ui/              # Shadcn components (button, card, etc.)
  arena/           # Domain components
    Header.tsx
    ChatInput.tsx
    PromptCard.tsx
    ProviderGrid.tsx
    ProviderCard.tsx
    JudgeCard.tsx
    FinalAnswerCard.tsx
    EmptyState.tsx
    ErrorState.tsx
    StreamingCursor.tsx
hooks/
  useArenaStream.ts # Hook to parse SSE stream and update state
lib/
  utils.ts
```

## Performance Improvements
- Progressive streaming reduces perceived latency to near-zero.
- Memoizing complex markdown rendering using `react-markdown`.
- Lazy loading syntax highlighters.

## Accessibility Improvements
- Keyboard navigable components.
- Semantic HTML (proper heading hierarchy).
- `aria-live` regions for streaming text.
- High contrast colors (zinc/slate on black).

## Responsive Improvements
- Desktop-first Bento Grid (max-width 1400px).
- Graceful stacking on Tablet and Mobile.

## Final Recommendations
1. Install required dependencies (`shadcn`, `framer-motion`, `lucide-react`, `react-markdown`).
2. Configure Tailwind v4 for strict dark mode (monochrome palette).
3. Completely rewrite `/api/ai` to yield a `ReadableStream` (SSE).
4. Build the UI iteratively, starting with the layout, then provider cards, then the judge card.
