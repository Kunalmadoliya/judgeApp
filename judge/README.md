# AlmostFiesta

A simple AI evaluation engine that compares responses from multiple AI models and picks the best one.

## Flow

```text
                Your Prompt
                     │
                     ▼
          ┌───────────────────┐
          │   Parallel Calls   │
          └───────────────────┘
           │        │        │
           ▼        ▼        ▼
      Cerebras   Gemini    Groq
           │        │        │
           └────────┼────────┘
                    ▼
         OpenAI Evaluation Engine
                    │
      Scores every response on
      • Accuracy
      • Clarity
      • Completeness
                    │
                    ▼
           🏆 Picks the Winner
                    │
                    ▼
      Final Answer + Reason + Scores
```

## Example Response

```json
{
  "success": true,
  "response": {
    "reply": {
      "winner": "groq",
      "scores": {
        "cerebras": {
          "accuracy": 2,
          "clarity": 3,
          "completeness": 2
        },
        "gemini": {
          "accuracy": 1,
          "clarity": 2,
          "completeness": 1
        },
        "groq": {
          "accuracy": 9,
          "clarity": 8,
          "completeness": 9
        }
      },
      "reason": "Groq provided the most accurate and complete response.",
      "finalAnswer": "JavaScript is a programming language used to build interactive web applications..."
    }
  }
}
```

## Tech Stack

* Next.js
* TypeScript
* Tailwind CSS
* OpenAI
* Gemini
* Groq
* Cerebras

---

**Compare answers, not just models.**
