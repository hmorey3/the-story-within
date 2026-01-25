import type { PromptSuggestion } from '../types/chatbot'

export const formatPromptLabel = (suggestion: PromptSuggestion) => {
  if (suggestion.mode === 'prefix') {
    return `${suggestion.label}...`
  }

  return suggestion.label
}
