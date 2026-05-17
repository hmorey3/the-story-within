/**
 * Story runtime — drives the structured card-pick flow.
 *
 * Flow:
 *   1. Opening message streams → Challenge cards appear (no text input)
 *   2. User picks a card → adapter streams transition question for next dimension → cards appear
 *   3. Repeat for all 7 dimensions (no text input throughout)
 *   4. After 7th pick → show elaboration prompt with text input + skip button
 *   5a. User types details → extraction with freeform text
 *   5b. User clicks skip → extraction immediately
 *   6. Extraction → onComplete(bookId)
 */

import { useLocalRuntime, type ChatModelAdapter } from '@assistant-ui/react'
import { useRef, useState } from 'react'
import { OPENING_GREETING, PRONOUNS_QUESTION, CHALLENGE_INTRO, elaborationPrompt, DIMENSION_ORDER, DIMENSIONS } from './storyContent'
import { requestBeatExtraction } from '../services/openaiChatbot'
import { createBookFromExtraction } from '../services/chatbotBooks'

const CHOICE_PREFIX = '__CHOICE__:'

export type SelectedChoice = {
  dimensionId: string
  beatId: string
  title: string
  description: string
}

type UseStoryRuntimeOptions = {
  onComplete: (bookId: string) => void
}

export function useStoryRuntime({ onComplete }: UseStoryRuntimeOptions) {

  const dimensionIndexRef = useRef(-1)
  const [dimensionIndex, setDimensionIndex] = useState(-1)

  const [showOptions, setShowOptions] = useState(false)
  const [showComposer, setShowComposer] = useState(false)
  const [composerLarge, setComposerLarge] = useState(false)
  const [showSkipElaboration, setShowSkipElaboration] = useState(false)

  const [showPronounOptions, setShowPronounOptions] = useState(false)

  const selectedChoicesRef = useRef<SelectedChoice[]>([])
  const askingNameRef = useRef(false)
  const askingPronounsRef = useRef(false)
  const userNameRef = useRef('')
  const userPronounsRef = useRef('')
  const awaitingFreeformRef = useRef(false)
  const skippingElaborationRef = useRef(false)

  const pause = (ms: number) => new Promise((r) => setTimeout(r, ms))

  const streamWords = async function* (text: string) {
    yield { content: [{ type: 'text' as const, text }] }
  }

  const runExtraction = async function* (freeformText?: string) {
    yield { content: [{ type: 'text' as const, text: 'Shaping your story now...' }] }
    try {
      const extraction = await requestBeatExtraction({
        choices: selectedChoicesRef.current,
        name: userNameRef.current,
        pronouns: userPronounsRef.current,
        freeformText,
      })
      const newBook = createBookFromExtraction(extraction)
      yield {
        content: [{ type: 'text' as const, text: 'Your story is taking shape. Opening your storybook now.' }],
      }
      setTimeout(() => onComplete(newBook.id), 800)
    } catch {
      yield {
        content: [{ type: 'text' as const, text: 'Sorry, I had trouble shaping your story. Please try again.' }],
      }
    }
  }

  const adapter: ChatModelAdapter = {
    async *run(options) {
      const { messages } = options

      const lastMsg = messages[messages.length - 1]
      const lastUserText =
        lastMsg?.role === 'user'
          ? lastMsg.content
              .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
              .map((p) => p.text)
              .join('')
          : ''

      // --- Opening: ask for name ---
      if (messages.length === 0) {
        await pause(1200)
        yield* streamWords(OPENING_GREETING)
        askingNameRef.current = true
        setComposerLarge(false)
        setShowComposer(true)
        return
      }

      // --- Card pick: user selected an option ---
      if (lastUserText.startsWith(CHOICE_PREFIX)) {
        const payload = lastUserText.slice(CHOICE_PREFIX.length)
        const [choiceId, choiceTitle, ...descParts] = payload.split(':')
        const choiceDescription = descParts.join(':')

        // Pronoun pick
        if (askingPronounsRef.current) {
          askingPronounsRef.current = false
          setShowPronounOptions(false)
          userPronounsRef.current = choiceTitle
          await pause(600)
          yield* streamWords(CHALLENGE_INTRO)
          await pause(400)
          dimensionIndexRef.current = 0
          setDimensionIndex(0)
          setShowOptions(true)
          return
        }

        // Dimension pick
        const dimIdx = dimensionIndexRef.current
        const dimensionId = DIMENSION_ORDER[dimIdx]

        // Store the choice
        selectedChoicesRef.current = [
          ...selectedChoicesRef.current,
          {
            dimensionId: dimensionId ?? '',
            beatId: choiceId,
            title: choiceTitle,
            description: choiceDescription,
          },
        ]

        const next = dimIdx + 1
        dimensionIndexRef.current = next
        setDimensionIndex(next)

        if (next >= DIMENSION_ORDER.length) {
          const name = userNameRef.current
          await pause(600)
          yield* streamWords(elaborationPrompt(name))
          setComposerLarge(true)
          setShowComposer(true)
          setShowSkipElaboration(true)
          awaitingFreeformRef.current = true
        } else {
          await pause(600)
          const nextDimId = DIMENSION_ORDER[next]
          const transitionQuestion = DIMENSIONS[nextDimId]?.transitionQuestion
          if (transitionQuestion) {
            yield* streamWords(transitionQuestion)
          }
          await pause(400)
          setShowOptions(true)
        }
        return
      }

      // --- Skip elaboration ---
      if (skippingElaborationRef.current) {
        skippingElaborationRef.current = false
        yield* runExtraction()
        return
      }

      // --- Name input: store name, then ask pronouns ---
      if (askingNameRef.current) {
        askingNameRef.current = false
        const raw = lastUserText.trim() || 'friend'
        const name = raw.charAt(0).toUpperCase() + raw.slice(1)
        userNameRef.current = name
        setShowComposer(false)
        await pause(600)
        yield* streamWords(PRONOUNS_QUESTION)
        askingPronounsRef.current = true
        setShowPronounOptions(true)
        return
      }

      // --- Freeform story input ---
      if (awaitingFreeformRef.current) {
        awaitingFreeformRef.current = false
        setShowComposer(false)
        setShowSkipElaboration(false)
        yield* runExtraction(lastUserText)
        return
      }
    },
  }

  const runtime = useLocalRuntime(adapter)

  const onChoice = (choiceId: string, choiceTitle: string, choiceDescription: string) => {
    setShowOptions(false)
    runtime.thread.append({
      role: 'user',
      content: [{ type: 'text', text: `${CHOICE_PREFIX}${choiceId}:${choiceTitle}:${choiceDescription}` }],
    })
  }

  const skipElaboration = () => {
    awaitingFreeformRef.current = false
    skippingElaborationRef.current = true
    setShowComposer(false)
    setShowSkipElaboration(false)
    runtime.thread.append({
      role: 'user',
      content: [{ type: 'text', text: 'No further details, write my story' }],
    })
  }

  return { runtime, dimensionIndex, showOptions, showPronounOptions, showComposer, composerLarge, showSkipElaboration, onChoice, skipElaboration }
}
