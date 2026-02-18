# Specification

## Summary
**Goal:** Ensure generated riddle answers are full solutions derived from the provided clue IDs and riddle text, not an echoed copy of the riddle.

**Planned changes:**
- Update backend `generateAnswer(imageClueIds, riddle)` to always return a non-empty full-solution response (final answer + brief explanation referencing provided clue IDs), never returning text that exactly matches the input riddle.
- Handle invalid/inaccessible `imageClueIds` by explicitly listing unavailable IDs while still attempting a best-effort solution using any remaining valid clues.
- Preserve existing authenticated-user authorization behavior for answer generation.
- Update frontend answer-generation UX copy to state it generates a “full solution” (not a restatement).
- Ensure the frontend output area renders multi-paragraph (multi-line, including blank lines) solution text without truncation and keeps the echoed-riddle safeguard compatible with valid full solutions.

**User-visible outcome:** Users receive a clear final answer plus a short explanation (including which clue IDs were used), and the UI displays multi-paragraph solutions properly instead of showing the riddle text echoed back.
