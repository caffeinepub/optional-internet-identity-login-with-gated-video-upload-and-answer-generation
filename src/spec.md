# Specification

## Summary
**Goal:** Prevent generated answers from echoing the user’s riddle text, and allow answer generation without requiring a custom riddle.

**Planned changes:**
- Fix the frontend-to-backend answer generation flow so the riddle text is sent as input and the backend returns a generated answer string that is displayed as “Generated Answer.”
- Update the backend `generateAnswer` behavior to accept empty/whitespace riddle input and still return a non-empty generated answer, while continuing to persist the generated answer in canister state.
- Add a UI control (e.g., toggle/checkbox) to optionally provide a custom riddle; update validation and error messaging so generating is allowed when custom riddle input is disabled.

**User-visible outcome:** Users can generate an answer that is not a repeat of their entered riddle, and they can generate an answer even without entering any riddle text by leaving the custom riddle option off.
