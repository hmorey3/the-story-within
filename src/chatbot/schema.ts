// generated from openaiChatbot.ts

export const responseSchema = {
  name: 'story_response',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: [
      'fulfilledCategories',
      'missingCategories',
      'beatRecommendations',
      'titleRecommendation',
      'nextQuestionFromAI',
      'summary',
      'promptSuggestionsForUser',
      'isComplete',
    ],
    properties: {
      fulfilledCategories: {
        type: 'array',
        items: { type: 'string' },
      },
      missingCategories: {
        type: 'array',
        items: { type: 'string' },
      },
      beatRecommendations: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['category', 'beatId', 'rationale', 'summary'],
          properties: {
            category: { type: 'string' },
            beatId: { type: 'string' },
            rationale: { type: 'string' },
            summary: { type: 'string' },
          },
        },
      },
      titleRecommendation: {
        anyOf: [
          {
            type: 'object',
            additionalProperties: false,
            required: ['title', 'rationale'],
            properties: {
              title: { type: 'string' },
              rationale: { type: 'string' },
            },
          },
          { type: 'null' },
        ],
      },
      nextQuestionFromAI: { type: 'string' },
      summary: { type: 'string' },
      promptSuggestionsForUser: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['label', 'mode'],
          properties: {
            label: { type: 'string' },
            mode: { type: 'string' },
          },
        },
      },
      isComplete: { type: 'boolean' },
    },
  },
}
