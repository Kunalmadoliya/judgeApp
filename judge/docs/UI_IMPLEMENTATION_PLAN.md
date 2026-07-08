# UI Implementation Plan

## Screens
1. **Main Arena Screen (`app/page.tsx`)**: The single page of the application containing the entire workflow from empty state to final evaluation.

## Component Hierarchy & Responsibilities
```text
<ArenaPage> (Manages main layout and stream lifecycle hook)
  <Header /> (Displays Logo, Title, Subtitle, GitHub button)
  <EmptyState /> (Rendered initially)
  <ChatInput /> (Handles prompt submission, handles loading state)
  
  <ArenaLayout> (Bento Grid Container)
    <PromptCard /> (Displays original prompt, timestamp, copy btn)
    
    <ProviderGrid> (3-column CSS Grid layout)
      <ProviderCard provider="cerebras" ... /> (Streams Cerebras response)
      <ProviderCard provider="gemini" ... /> (Streams Gemini response)
      <ProviderCard provider="groq" ... /> (Streams Groq response)
    </ProviderGrid>

    <JudgeCard /> (Displays winner badge, reason, and animated score table)
    <FinalAnswerCard /> (Renders markdown of the final compiled answer)
  </ArenaLayout>
</ArenaPage>
```

## State Management
- **`useArenaStream` Hook:** Manages the SSE `ReadableStream` from `/api/ai`.
- **State Object:**
  - `status`: `'idle' | 'streaming' | 'evaluating' | 'complete' | 'error'`
  - `prompt`: String
  - `providers`: Object tracking `text`, `status`, `latency`, `wordCount`, `charCount` for Cerebras, Gemini, Groq.
  - `judge`: The final evaluation JSON object.
- **Data Flow:** UI components receive state purely as props from the parent hook to ensure unidirectional data flow.

## API Integration (The Single Endpoint)
- **Route:** `POST /api/ai`
- **Mechanism:** Returns a `ReadableStream`.
- **Event Shape:** The backend will stream chunks like:
  - `{"type": "provider_chunk", "provider": "cerebras", "text": "Hello"}`
  - `{"type": "provider_status", "provider": "gemini", "status": "complete", "latency": 1200}`
  - `{"type": "judge_status", "status": "evaluating"}`
  - `{"type": "judge_result", "data": { "winner": "...", "scores": {...}, ... }}`

## UI States
- **Empty State:** Centered logo, title, subtitle, and the `ChatInput`. No cards visible.
- **Loading / Streaming States:** 
  - *Cerebras:* "Thinking..." followed by streaming text.
  - *Gemini:* "Generating..." followed by streaming text.
  - *Groq:* "Streaming..." followed by streaming text.
  - *Judge:* "Waiting for all providers..." -> "Evaluating..."
- **Error States:** Handled inline. If a provider fails, the card shows an error state with a retry button, allowing others to continue.

## Animations (Framer Motion)
- **Layout Transitions:** Transition from centered empty state to top-aligned grid (`layoutId` or `<motion.div layout>`).
- **Cards:** Staggered fade and slide up (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`).
- **Score Bars:** Progress bars animate smoothly from 0 to their score (`animate={{ width: `${score * 10}%` }}`).
- **Streaming Cursor:** A blinking `<StreamingCursor />` component at the end of active generation.

## Responsive Behavior
- **Desktop (1400px):** Full Bento Grid. Providers side-by-side in 3 columns.
- **Tablet (768px - 1024px):** Providers stack in 2 columns or wrap natively.
- **Mobile (< 768px):** 1 column. Everything stacks vertically.

## Accessibility
- Tab navigation for buttons (Copy, Retry, Submit).
- `aria-live="polite"` on provider responses.
- `aria-hidden` on SVGs.
- Focus rings on the ChatInput and buttons using Tailwind's `focus-visible`.

## Folder Structure
```text
app/
  page.tsx
  layout.tsx
  globals.css
  api/
    ai/
      route.ts
components/
  ui/
    button.tsx
    textarea.tsx
    card.tsx
    progress.tsx
    skeleton.tsx
  arena/
    Header.tsx
    ChatInput.tsx
    PromptCard.tsx
    ProviderGrid.tsx
    ProviderCard.tsx
    JudgeCard.tsx
    FinalAnswerCard.tsx
    StreamingCursor.tsx
    WinnerBadge.tsx
hooks/
  useArenaStream.ts
lib/
  utils.ts
  types.ts
```

## Implementation Order
1. **Setup:** Install dependencies (`shadcn`, `framer-motion`, `lucide-react`, `react-markdown`). Configure Tailwind v4 for monochrome dark theme.
2. **Backend Refactor:** Rewrite `/api/ai` to yield a `ReadableStream` parsing chunks from Cerebras, Gemini, Groq, and finally the OpenAI judge.
3. **State Hook:** Implement `useArenaStream` to consume the SSE chunks.
4. **Layout & Core UI:** Build the Header, Empty State, and Chat Input.
5. **Provider Cards:** Implement `ProviderCard`, `ProviderGrid`, and markdown rendering.
6. **Judge & Final Answer:** Build `JudgeCard` with animated bars and `FinalAnswerCard`.
7. **Polish:** Apply Framer Motion, accessibility tags, and responsive spacing.
