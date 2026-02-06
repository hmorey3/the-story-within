import type { PromptSuggestion } from './types'

export const formatPromptLabel = (suggestion: PromptSuggestion) => {
  if (suggestion.mode === 'prefix') {
    const trimmed = suggestion.label.trim()
    // Don't add ellipsis if already present
    if (trimmed.endsWith('…') || trimmed.endsWith('...')) {
      return suggestion.label
    }
    return `${suggestion.label}...`
  }

  return suggestion.label
}
