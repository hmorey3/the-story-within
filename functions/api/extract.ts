import Anthropic from '@anthropic-ai/sdk'

interface Env {
  ANTHROPIC_API_KEY: string
}

const extractionTool = {
  name: 'beat_extraction',
  description: 'Extract story beats from the structured interview',
  input_schema: {
    type: 'object' as const,
    required: ['beats', 'title'],
    properties: {
      beats: {
        type: 'array' as const,
        items: {
          type: 'object' as const,
          required: ['beatId', 'label', 'summary'],
          properties: {
            beatId: { type: 'string' as const },
            label: { type: 'string' as const },
            summary: { type: 'string' as const },
          },
        },
      },
      title: { type: 'string' as const },
    },
  },
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { systemPrompt } = await context.request.json() as { systemPrompt: string }

  if (!systemPrompt) {
    return new Response(JSON.stringify({ error: 'Missing systemPrompt' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const client = new Anthropic({ apiKey: context.env.ANTHROPIC_API_KEY })

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: 'Extract the story beats from my choices.' }],
    tools: [extractionTool],
    tool_choice: { type: 'tool', name: 'beat_extraction' },
    temperature: 0.4,
  })

  const toolBlock = response.content.find((block) => block.type === 'tool_use')
  if (!toolBlock || toolBlock.type !== 'tool_use') {
    return new Response(JSON.stringify({ error: 'No tool use in response' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(toolBlock.input), {
    headers: { 'Content-Type': 'application/json' },
  })
}
