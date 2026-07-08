# Fix Plan

This plan details the order in which the identified errors will be safely resolved.

## 1. Syntax Errors
* **`lib/cerebras/index.ts` (Line 29)**: Restore the generator asterisk to `export async function askCerebras` to fix the `Expression expected` syntax error caused by the `yield` keyword. Remove the unused `import { log } from 'console'`.

## 2. Build Errors
* Fixing the syntax error above will resolve the Turbopack build failure.

## 3. Import/Export Errors
* **`app/page.tsx`**: Re-add the necessary module imports (`useArenaStream`, frontend components from `components/arena/*`) and the default export `ArenaPage` so Next.js can compile the root route.

## 4. App Router Errors
* None pending beyond the empty root route fixed in step 3.

## 5. Runtime Errors
* Populating `app/page.tsx` with a valid React component will stop the immediate runtime crash on initial load.

## 6. TypeScript Errors
* Address the implicit `any` in `app/api/ai/route.ts` and `hooks/useArenaStream.ts` where safe to do so without introducing complex types that harm readability. (e.g. changing `catch (error: any)` to `catch (error)` or `catch (error: unknown)` and typing the events).

## 7. React Errors (ESLint)
* **`hooks/useArenaStream.ts`**:
  * Hoist `const handleStreamEvent = useCallback(...)` above `const submitPrompt = useCallback(...)` to fix the "accessed before declaration" ESLint error.
  * Add `handleStreamEvent` to the dependency array of `submitPrompt`.
  * Fix the unused variable `e` in the `try/catch` parsing block.

## 8. Hydration Issues
* None detected.

## 9. UI Bugs
* **`app/layout.tsx`**: Re-add the `dark` class to the `<html>` tag and the `bg-dotted-grid bg-zinc-950 text-zinc-50` classes to the `<body>` tag to ensure the components render correctly against the dark theme.

## 10. Performance Improvements
* None strictly necessary for functionality.

## 11. Code Cleanup
* Ensure all files adhere strictly to the simple, functional style without any unnecessary boilerplate or wrappers.
