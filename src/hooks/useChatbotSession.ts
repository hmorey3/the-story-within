import { useEffect, useReducer, useState } from 'react'
import { storyBeats } from '../data/storyBeats'
import { titleOptions } from '../data/storyCatalog'
import { storyBeatCategories } from '../data/beatCategories'
import { createBookFromResponse } from '../services/chatbotBooks'
import { requestOpenAiChatbotTurn } from '../services/openaiChatbot'
import type { ChatbotApiResponse, PromptSuggestion } from '../types/chatbot'

// Types
type ChatMessage = {
  id: string
  role: 'assistant' | 'user'
  content: string
}

type SessionState = {
  messages: ChatMessage[]
  promptSuggestions: PromptSuggestion[]
  isLoading: boolean
}

type SessionAction =
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'SET_LOADING'; isLoading: boolean }
  | { type: 'HANDLE_RESPONSE'; response: ChatbotApiResponse }
  | { type: 'RESET' }

// Helpers
const createMessageId = () => `msg-${Date.now()}-${Math.random().toString(16).slice(2)}`

const createAssistantMessage = (content: string): ChatMessage => ({
  id: createMessageId(),
  role: 'assistant',
  content,
})

const createUserMessage = (content: string): ChatMessage => ({
  id: createMessageId(),
  role: 'user',
  content,
})

const initialState: SessionState = {
  messages: [],
  promptSuggestions: [],
  isLoading: false,
}

// Reducer
function sessionReducer(state: SessionState, action: SessionAction): SessionState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message] }

    case 'SET_LOADING':
      return { ...state, isLoading: action.isLoading }

    case 'HANDLE_RESPONSE':
      return {
        ...state,
        promptSuggestions: action.response.promptSuggestionsForUser ?? [],
        isLoading: false,
      }

    case 'RESET':
      return initialState

    default:
      return state
  }
}

// API helpers
const buildPayload = (messages: ChatMessage[]) => ({
  messages,
  beats: storyBeats.map((beat) => ({
    id: beat.id,
    title: beat.title,
    category: beat.category,
  })),
  titles: titleOptions,
  categories: storyBeatCategories,
  titleMaxLength: 10,
})

async function callChatbotApi(
  messages: ChatMessage[],
  userInput: string
): Promise<ChatbotApiResponse> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string | undefined
  if (!apiKey) throw new Error('Missing VITE_OPENAI_API_KEY')

  return requestOpenAiChatbotTurn({
    apiKey,
    messages,
    payload: { ...buildPayload(messages), userInput },
  })
}

// Hook
type UseChatbotSessionOptions = {
  isOpen: boolean
  onComplete: (bookId: string) => void
}

export const useChatbotSession = ({ isOpen, onComplete }: UseChatbotSessionOptions) => {
  const [inputValue, setInputValue] = useState('')
  const [state, dispatch] = useReducer(sessionReducer, initialState)

  // Initial message on open
  useEffect(() => {
    if (!isOpen || state.messages.length > 0) return

    let active = true
    dispatch({ type: 'SET_LOADING', isLoading: true })

    callChatbotApi([], '')
      .then((response) => {
        if (!active) return
        dispatch({ type: 'ADD_MESSAGE', message: createAssistantMessage(response.nextQuestionFromAI) })
        dispatch({ type: 'HANDLE_RESPONSE', response })
      })
      .catch(() => {
        if (!active) return
        dispatch({ type: 'ADD_MESSAGE', message: createAssistantMessage('Sorry, I could not reach the chatbot service. Please try again.') })
        dispatch({ type: 'SET_LOADING', isLoading: false })
      })

    return () => { active = false }
  }, [isOpen, state.messages.length])

  const submitMessage = async (messageText?: string) => {
    const trimmed = (messageText ?? inputValue).trim()
    if (!trimmed || state.isLoading) return

    const userMessage = createUserMessage(trimmed)
    const nextMessages = [...state.messages, userMessage]

    dispatch({ type: 'ADD_MESSAGE', message: userMessage })
    dispatch({ type: 'SET_LOADING', isLoading: true })
    setInputValue('')

    let response: ChatbotApiResponse
    try {
      response = await callChatbotApi(nextMessages, trimmed)
    } catch {
      dispatch({ type: 'ADD_MESSAGE', message: createAssistantMessage('Sorry, I could not reach the chatbot service. Please try again.') })
      dispatch({ type: 'SET_LOADING', isLoading: false })
      return
    }

    dispatch({ type: 'HANDLE_RESPONSE', response })
    dispatch({ type: 'ADD_MESSAGE', message: createAssistantMessage(response.nextQuestionFromAI) })

    // AI signals completion - create the book with final beat recommendations
    if (response.isComplete) {
      const title = response.titleRecommendation?.title ?? 'Untitled'
      const newBook = createBookFromResponse({
        title,
        beatRecommendations: response.beatRecommendations,
      })
      onComplete(newBook.id)
      dispatch({ type: 'RESET' })
    }
  }

  return {
    inputValue,
    setInputValue,
    messages: state.messages,
    pendingResponse: state.isLoading,
    promptSuggestionsForUser: state.promptSuggestions,
    submitMessage,
  }
}
