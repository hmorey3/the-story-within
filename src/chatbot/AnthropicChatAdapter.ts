/**
 * Custom ChatModelAdapter that streams responses from Claude Sonnet
 * via the Anthropic SDK. Yields cumulative text on each delta for
 * progressive rendering in @assistant-ui/react.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { ChatModelAdapter, ChatModelRunOptions } from '@assistant-ui/react'
import { CONVERSATION_PROMPT } from '../prompts'

function convertMessages(messages: ChatModelRunOptions['messages']) {
  return messages.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content
      .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
      .map((p) => p.text)
      .join(''),
  }))
}

export function createAnthropicChatAdapter(apiKey: string): ChatModelAdapter {
  return {
    async *run({ messages, abortSignal }) {
      const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
      const anthropicMessages = convertMessages(messages)
      const turnCount = anthropicMessages.filter((m) => m.role === 'user').length

      const stream = client.messages.stream({
        model: 'claude-sonnet-4-6',
        max_tokens: 300,
        system: `${CONVERSATION_PROMPT}\n\n[Turn ${turnCount} of conversation]`,
        messages: anthropicMessages,
        temperature: 0.7,
      })

      abortSignal.addEventListener('abort', () => {
        stream.abort()
      })

      let text = ''
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          text += event.delta.text
          yield { content: [{ type: 'text' as const, text }] }
        }
      }
    },
  }
}
