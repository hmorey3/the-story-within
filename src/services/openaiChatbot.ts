/**
 * AI API integration — calls the /api/extract Pages Function
 * which proxies Anthropic Claude. All prompts live in src/prompts.ts.
 */

import { titleOptions } from '../data/storyCatalog'
import { buildExtractionPrompt } from '../prompts'
import type { SelectedChoice } from '../chatbot/useStoryRuntime'
import type { BeatExtractionResponse } from '../types/chatbot'

type BeatExtractionOptions = {
  choices: SelectedChoice[]
  name: string
  pronouns: string
  freeformText?: string
}

export const requestBeatExtraction = async ({
  choices,
  name,
  pronouns,
  freeformText,
}: BeatExtractionOptions): Promise<BeatExtractionResponse> => {
  const systemPrompt = buildExtractionPrompt({
    choices,
    name,
    pronouns,
    freeformText,
    titles: [...titleOptions],
  })

  const res = await fetch('/api/extract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ systemPrompt }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || 'Extraction request failed')
  }

  return res.json() as Promise<BeatExtractionResponse>
}
