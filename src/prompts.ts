/**
 * All AI prompts live here — the opening message, the follow-up question prompt,
 * and the beat extraction prompt.
 */

// --- Beat extraction prompt (used after all 7 dimensions are collected) ---

import type { SelectedChoice } from './chatbot/useStoryRuntime'

const formatTitleList = (titles: string[]) =>
  titles.length === 0 ? '- None' : titles.map((t) => `- ${t}`).join('\n')

type ExtractionContext = {
  choices: SelectedChoice[]
  name: string
  pronouns: string
  freeformText?: string
  titles: string[]
}

export const buildExtractionPrompt = ({ choices, name, pronouns, freeformText, titles }: ExtractionContext) => {
  const choiceLines = choices
    .map((c) => `  ${c.dimensionId.toUpperCase()} → ${c.beatId} ("${c.title}"): ${c.description}`)
    .join('\n')

  const freeformSection = freeformText
    ? `\nIn their own words:\n"${freeformText}"\n`
    : ''

  return `You are a story architect helping ${name} shape their personal story. They completed a structured self-reflection interview, choosing one archetype per dimension. Your job is to render their story in mythic form.

Their seven choices:
${choiceLines}
${freeformSection}
Return the beats array in this narrative order — the story's telling order, not the interview order:
  1. protagonist  2. shift  3. quest  4. allies  5. challenge  6. transformation  7. legacy

For each dimension, populate three fields:

  beatId  — the exact beat ID shown above (e.g. "challenge-external")
  label   — a poetic title personal to ${name}'s story — not the generic archetype name
              (e.g. "The Weight She Carried Alone", "When the Floor Gave Way")
              STRICT LIMIT: 22 characters maximum (including spaces). Count carefully before returning.
  summary — 2–3 sentences in mythic, poetic language, written in third person about ${name}
              — refer to ${name} by name, using ${pronouns} pronouns
              — if they shared a freeform story, draw on its specific details
              — if not, interpret their archetype choices with depth and care
              — do not fabricate specifics they did not provide
              STRICT LIMIT: 192 characters maximum (including spaces). Be concise and evocative.

TITLE SELECTION:
Select a title from this approved list that best captures the essence of their whole story:
${formatTitleList(titles)}
If none fit, create a short evocative title (max 10 characters).

Use the tool schema to return your response.`
}
