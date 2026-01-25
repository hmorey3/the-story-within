# Chatbot Technical Plan (Repo-Specific)

## Overview
Implement a client-side chatbot that collects a personal development story, confirms a literal summary, then generates a “story book” composed of mapped story beats (with poetic notes) and a title selected from the existing library. Reuse existing book + story beat scaffolding and storage.

## Existing Building Blocks
- `src/data/storyBeats.ts`: story beat archetypes + images.
- `src/data/books.ts`: book storage + beat notes (persisted in localStorage).
- `src/defaults.json`: virtue titles (current title library).
- `src/pages/LibraryPage.tsx`: bookshelf UI and title-based books.
- `src/pages/StoryBeatsCarousel.tsx`: view/edit beats; beat `note` field for text.
- `src/router.tsx`: lightweight router; add chatbot route here.

## Proposed Additions
- New floating widget: `src/components/ChatbotWidget.tsx` (chat UI + logic).
- New styles: `src/components/ChatbotWidget.css`.
- New data helper: `src/data/beatCategories.ts` (category list + mapping rules).
- New conversation state types: `src/types/chat.ts` (or colocated in widget).

## Data Model Updates
- Add a category mapping for story beats:
  - Extend `StoryBeat` with `category` in `src/data/storyBeats.ts`.
- Store generated poetic summaries in `StoryBeatEntry.note` (already persisted).
- Store the chosen title in existing `Book.title` (already persisted).

## Conversation Flow Implementation
- Hardcode the category-aligned prompts from `chatbot-requirements.md`.
- Allow follow-up prompts to fill missing categories (off-script allowed).
- After core questions, generate a literal recap and ask for confirmation.
- On confirmation: choose a title from `defaults.json` virtues; propose it.
- If user rejects: allow custom title input (max 10 chars).
- Use OpenAI API in the background to drive turn-based logic.
- Each turn returns JSON with:
  - `fulfilledCategories`: string[]
  - `missingCategories`: string[]
  - `beatRecommendations`: { category: string; beatId: string; rationale: string; summary: string }[]
  - `titleRecommendation`: { title: string; rationale: string } | null
  - `nextQuestion`: string
- When calling the API, dynamically include the current beat list from `src/data/storyBeats.ts`
  and the current title list from `src/defaults.json` so adding new beats/titles only requires
  updating those data files.

## Beat Category Mapping Logic
- Maintain five required categories:
  - The Old World
  - The Call
  - The Descent
  - The Turning
  - The Integration
- Ensure at least one beat is mapped to each category before finishing.
- Map categories to beat archetypes using a simple rules table, e.g.:
  - The Old World -> `strange-omen` or `maiden`
  - The Call -> `call-to-adventure`
  - The Descent -> `descend-into-abyss`
  - The Turning -> `facing-the-dragon`
  - The Integration -> `treasure` or `wizard`
- If user story suggests different archetype, prefer that match; otherwise fall back to the defaults above.
- Users cannot choose archetypes; chatbot selects all beat mappings.

## Poetic Summary Generation
- Convert each category answer into a 1–3 sentence poetic summary.
- Use OpenAI responses to generate summaries per category once enough info is present.
- Store each summary as the beat `note` in the new book entry.

## Title Selection
- Use `defaults.json` virtues as the title library.
- Select the best match based on:
  - User-chosen virtues (Q7)
  - Tone alignment (Q8) as a tie-breaker
- Offer user acceptance or custom title input (max 10 chars).

## UI Integration
- Mount `ChatbotWidget` on `LibraryPage` (or in `src/App.tsx` for global access).
- Floating icon fixed bottom-right; expands into a small panel when opened.
- Chat UI panel:
  - message list (user + bot)
  - input box (text + optional quick replies)
  - progress indicator for categories collected

## Storage & Book Creation
- Once confirmed + title accepted:
  - Create a new `Book` with `createBookId()` and title.
  - Populate `beats` with mapped archetypes + poetic notes.
  - `writeStoredBooks()` then navigate to `/story-beats/<bookId>`.

## Testing / Validation
- Manual checklist:
  - Complete story capture leads to 5 categories.
  - Confirm summary gate blocks beat generation until accepted.
  - Title selection flows: accept vs custom (<=10 chars).
  - New book appears in library + beats view shows notes.

## Open Decisions
- Which mapping rules to use between categories and specific archetypes.
- Whether to keep beat notes editable after chatbot generation.
- How to handle users who skip or refuse category questions.
