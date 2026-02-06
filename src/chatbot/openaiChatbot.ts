import OpenAI from 'openai'
import { titleOptions } from '../data/storyCatalog'
import type { ChatbotApiResponse } from './types'
import { buildSystemPrompt } from './prompt'
import { responseSchema } from './schema'

type OpenAiRequestOptions = {
  apiKey: string
  messages: { role: 'assistant' | 'user'; content: string }[]
  payload: Record<string, unknown>
}

export const requestOpenAiChatbotTurn = async ({
  apiKey,
  messages,
  payload,
}: OpenAiRequestOptions): Promise<ChatbotApiResponse> => {
  const client = new OpenAI({ apiKey, dangerouslyAllowBrowser: true })

  const response = await client.responses.create({
    model: 'gpt-5.2',
    input: [
      { role: 'system', content: buildSystemPrompt([...titleOptions]) },
      {
        role: 'user',
        content: JSON.stringify({
          ...payload,
          conversation: messages,
        }),
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        ...responseSchema,
      },
    },
    temperature: 0.7,
  })

  if (!response.output_text) throw new Error('OpenAI response missing output_text')

  return JSON.parse(response.output_text) as ChatbotApiResponse
}
