# Chatbot Requirements (Draft)

## Goals
- Guide users through a conversational flow to capture a personal development story.
- Break the story into 3–7 story beats.
- Map each beat to a mythical story beat archetype (with image).
- Generate 1–3 sentence poetic summaries per beat.
- Output a "story book" package: beats + a chosen title.
- Select a title from a library (titles include virtues like freedom, growth, courage).

## Non-Goals
- Build or replace existing story beat library/scaffolding.
- Implement the existing story beat selection UI (reuse).

## Users & Use Cases
- User wants to turn a real experience into a mythic, poetic story.

## Conversation Flow (High-Level)
- Guided questions to capture context, change, and outcome.
- Clarify tone and virtue themes (e.g., courage, growth).
- Summarize and confirm key events before generating beats.
- Offer title suggestion and allow acceptance or custom input.
- Chatbot may ask follow-ups and go off-script to complete missing categories.
- End with a literal (non-poetic) summary of the user's story, then propose a title.
- Confirm the summary before generating beats.

## Chat Flow Questions (Draft)
- Q1: In 1–3 sentences, what personal development experience do you want to tell?
- Q2 (The Old World): What was life like before the change?
- Q3 (The Call): What sparked the need to change?
- Q4 (The Descent): What was the lowest point or deepest struggle?
- Q5 (The Turning): What shifted or what decision changed direction?
- Q6 (The Integration): How is your life different now?
- Q7: Which virtues best fit this story? (pick 1–2)
- Q8: What tone should the story feel like? (e.g., hopeful, fierce, gentle)
- Q9: Summary: <literal recap>. Here’s my suggested title: <Title>. Accept or type a custom title (max 10 chars).

## Inputs Captured
- Short narrative of the experience.
- Key characters/roles (self, allies, obstacles).
- Challenge, turning point, and resolution.
- Desired tone and virtue theme(s).

## Outputs
- Story beats (3–7), each with archetype, image reference, and poetic summary.
- Story book title (from library).
  - If user rejects suggested title, allow custom title up to 10 characters.

## Story Beat Mapping
- Use existing story beat library to map beats to archetypes.
- Each beat includes a 1–3 sentence poetic summary.
- Map beats to categories: The Old World, The Call, The Descent, The Turning, The Integration.
- Conversation can conclude once at least one beat is mapped to each category.

## Archetype Library Requirements
- Reuse current library entries (archetype name + image).

## Title Selection
- Use existing title library; chatbot selects best match to story theme.
- Offer user the option to reject and enter a custom title (max 10 chars).

## UI/UX Notes
- Chatbot drives collection; final output shows a story book view.

## Data & Storage
- Store chat session + generated story book for retrieval/editing.

## Safety & Ethics
- 

## Analytics & Metrics
- 

## Open Questions
- 
