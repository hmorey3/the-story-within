/**
 * Chat UI built from @assistant-ui/react headless primitives.
 * Renders streaming text, option cards per dimension, and progress diamonds.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

import {
  ThreadPrimitive,
  MessagePrimitive,
  ComposerPrimitive,
  useThreadRuntime,
  useMessage,
} from '@assistant-ui/react'
import { DIMENSION_ORDER, DIMENSIONS } from './storyContent'
import type { DimensionOption } from './storyContent'

// Symbolic SVG icons — one per dimension, fine-line style
const DimensionSVGs: Record<string, React.ReactNode> = {
  challenge: ( // Shield — what opposed you
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2L13.5 4.5v5Q8 14.5 8 14.5S2.5 9.5 2.5 9.5v-5z"/>
    </svg>
  ),
  protagonist: ( // Person — who you were
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5.5" r="3"/>
      <path d="M2 15q2.5-5 6-5q3.5 0 6 5"/>
    </svg>
  ),
  shift: ( // Forking path — what disrupted things
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="2" x2="8" y2="7.5"/>
      <line x1="8" y1="7.5" x2="4" y2="14"/>
      <line x1="8" y1="7.5" x2="12" y2="14"/>
    </svg>
  ),
  quest: ( // Compass — what you were after
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="8" r="6"/>
      <polyline points="6.5,5.5 8,2.5 9.5,5.5"/>
      <line x1="8" y1="2.5" x2="8" y2="13.5" strokeOpacity="0.35"/>
      <line x1="2.5" y1="8" x2="13.5" y2="8" strokeOpacity="0.35"/>
    </svg>
  ),
  allies: ( // Two figures — who helped
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="5.5" cy="5" r="2.5"/>
      <path d="M1 14q1.5-4 4.5-4q1.5 0 2.5 1"/>
      <circle cx="10.5" cy="5" r="2.5"/>
      <path d="M7.5 15q1-1 3-1q3 0 4.5 4"/>
    </svg>
  ),
  transformation: ( // Butterfly — how change happened
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 8q-1.5-3.5-5.5-2.5q.5 4 5.5 2.5"/>
      <path d="M8 8q1.5-3.5 5.5-2.5q-.5 4-5.5 2.5"/>
      <path d="M8 8q-1.5 3-4.5 3.5q1.5-2 4.5-3.5"/>
      <path d="M8 8q1.5 3 4.5 3.5q-1.5-2-4.5-3.5"/>
      <line x1="8" y1="6" x2="8" y2="12.5"/>
    </svg>
  ),
  legacy: ( // Seedling — what you carry forward
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="14.5" x2="8" y2="5.5"/>
      <path d="M8 5.5q-1.5-3-5-2q1.5 4 5 2"/>
      <path d="M8 10q1.5-3 5-2q-1.5 4-5 2"/>
    </svg>
  ),
}

function ProgressIcons({ count }: { count: number }) {
  return (
    <div className="chatbot__progress" aria-label="Story progress">
      {DIMENSION_ORDER.map((id, i) => (
        <div
          key={id}
          className={`chatbot__progress-icon${i < count ? ' chatbot__progress-icon--active' : ''}`}
          aria-label={DIMENSIONS[id].label}
        >
          {DimensionSVGs[id]}
          <span className="chatbot__progress-tooltip">{DIMENSIONS[id].label}</span>
        </div>
      ))}
    </div>
  )
}

function AutoStart() {
  const runtime = useThreadRuntime()
  useEffect(() => {
    runtime.startRun({ parentId: null })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}

function ThinkingIndicator() {
  return (
    <div className="chatbot__thinking" aria-label="Thinking">
      <span className="chatbot__thinking-dot" />
      <span className="chatbot__thinking-dot" />
      <span className="chatbot__thinking-dot" />
    </div>
  )
}

function AssistantMessage() {
  const msg = useMessage()

  if (msg.status.type === 'running') {
    return (
      <MessagePrimitive.Root className="chatbot__message chatbot__message--assistant">
        <ThinkingIndicator />
      </MessagePrimitive.Root>
    )
  }

  const text = msg.content
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')

  if (!text) return null

  return (
    <MessagePrimitive.Root className="chatbot__message chatbot__message--assistant">
      <p className="chatbot__message-text">{text}</p>
    </MessagePrimitive.Root>
  )
}

function SmartUserMessage() {
  const { content } = useMessage()
  const text = content
    .filter((p): p is { type: 'text'; text: string } => p.type === 'text')
    .map((p) => p.text)
    .join('')

  if (text.startsWith('__CHOICE__:')) {
    const [, title, ...descParts] = text.slice('__CHOICE__:'.length).split(':')
    const description = descParts.join(':')
    return (
      <MessagePrimitive.Root className="chatbot__message chatbot__message--user">
        <p className="chatbot__message-text">
          {title}{description ? ` — ${description}` : ''}
        </p>
      </MessagePrimitive.Root>
    )
  }

  return (
    <MessagePrimitive.Root className="chatbot__message chatbot__message--user">
      <p className="chatbot__message-text">{text}</p>
    </MessagePrimitive.Root>
  )
}

// Option card for a single dimension choice
type OptionCardProps = {
  option: DimensionOption
  onSelect: (option: DimensionOption) => void
}

function OptionCard({ option, onSelect }: OptionCardProps) {
  return (
    <button
      className="chatbot__option-card"
      type="button"
      onClick={() => onSelect(option)}
    >
      <span className="chatbot__option-title">{option.title}</span>
      {option.description && (
        <span className="chatbot__option-desc"> — {option.description}</span>
      )}
    </button>
  )
}

// The set of option cards for one dimension
type DimensionOptionsProps = {
  dimensionIndex: number
  onDimensionChoice: (id: string, title: string, description: string) => void
}

function DimensionOptions({ dimensionIndex, onDimensionChoice }: DimensionOptionsProps) {
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const tooltipRef = useRef<HTMLSpanElement>(null)

  const closeTooltip = useCallback((e: MouseEvent | TouchEvent) => {
    if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
      setTooltipOpen(false)
    }
  }, [])

  useEffect(() => {
    setTooltipOpen(false)
  }, [dimensionIndex])

  useEffect(() => {
    if (tooltipOpen) {
      document.addEventListener('mousedown', closeTooltip)
      document.addEventListener('touchstart', closeTooltip)
      return () => {
        document.removeEventListener('mousedown', closeTooltip)
        document.removeEventListener('touchstart', closeTooltip)
      }
    }
  }, [tooltipOpen, closeTooltip])

  if (dimensionIndex < 0 || dimensionIndex >= DIMENSION_ORDER.length) return null

  const dimId = DIMENSION_ORDER[dimensionIndex]
  const dim = DIMENSIONS[dimId]

  return (
    <>
      {dim.options.map((option) => (
        <OptionCard
          key={option.id}
          option={option}
          onSelect={(o) => onDimensionChoice(o.id, o.title, o.description)}
        />
      ))}
      <div className="chatbot__options-footer">
        <span
          className={`chatbot__options-tooltip${tooltipOpen ? ' chatbot__options-tooltip--open' : ''}`}
          ref={tooltipRef}
        >
          <span
            className="chatbot__options-tooltip-icon"
            onClick={() => setTooltipOpen(!tooltipOpen)}
          >
            Help
          </span>
          <span className="chatbot__options-tooltip-text">
            {dim.options.map((o) => (
              <span key={o.id} className="chatbot__options-tooltip-row">
                <strong>{o.title}</strong> — {o.axes}
              </span>
            ))}
          </span>
        </span>
      </div>
    </>
  )
}

const PRONOUN_OPTIONS = [
  { id: 'pronouns-she', title: 'she/her' },
  { id: 'pronouns-he', title: 'he/him' },
  { id: 'pronouns-they', title: 'they/them' },
]

type PronounOptionsProps = {
  onChoice: (id: string, title: string, description: string) => void
}

function PronounOptions({ onChoice }: PronounOptionsProps) {
  return (
    <>
      {PRONOUN_OPTIONS.map((p) => (
        <button
          key={p.id}
          className="chatbot__option-card"
          type="button"
          onClick={() => onChoice(p.id, p.title, '')}
        >
          <span className="chatbot__option-title">{p.title}</span>
        </button>
      ))}
    </>
  )
}

type ChatbotPanelProps = {
  dimensionIndex: number
  showOptions: boolean
  showPronounOptions: boolean
  showComposer: boolean
  composerLarge: boolean
  showSkipElaboration: boolean
  onChoice: (id: string, title: string, description: string) => void
  onSkipElaboration: () => void
}

export function ChatbotPanel({
  dimensionIndex,
  showOptions,
  showPronounOptions,
  showComposer,
  composerLarge,
  showSkipElaboration,
  onChoice,
  onSkipElaboration,
}: ChatbotPanelProps) {
  const hasOptions = showOptions || showPronounOptions || showSkipElaboration
  const [optionsVisible, setOptionsVisible] = useState(false)

  useEffect(() => {
    if (!hasOptions) {
      setOptionsVisible(false)
      return
    }
    const t = setTimeout(() => setOptionsVisible(true), 1000)
    return () => clearTimeout(t)
  }, [hasOptions])

  return (
    <ThreadPrimitive.Root className="chatbot__thread">
      <ThreadPrimitive.Viewport className="chatbot__messages">
        <AutoStart />
        <ThreadPrimitive.Messages
          components={{
            UserMessage: SmartUserMessage,
            AssistantMessage,
          }}
        />
      </ThreadPrimitive.Viewport>
      <ProgressIcons count={dimensionIndex} />
      <div className="chatbot__bottom-panel">
        <div className="chatbot__bottom-inner">
          <ThreadPrimitive.If running={false}>
            {optionsVisible && showPronounOptions && <PronounOptions onChoice={onChoice} />}
            {optionsVisible && showOptions && (
              <DimensionOptions
                dimensionIndex={dimensionIndex}
                onDimensionChoice={onChoice}
              />
            )}
            {optionsVisible && showSkipElaboration && (
              <button
                className="chatbot__option-card"
                type="button"
                onClick={onSkipElaboration}
              >
                <span className="chatbot__option-title">No further details, write my story</span>
              </button>
            )}
          </ThreadPrimitive.If>
          {showComposer && <ComposerArea large={composerLarge} />}
        </div>
      </div>
    </ThreadPrimitive.Root>
  )
}

const MAX_ELABORATION_CHARS = 500

const ELABORATION_EXAMPLE =
  "I'd been teaching for almost a decade and everyone saw me as the steady one. When my marriage fell apart, I realized I'd been holding everything together for everyone except myself. I moved to a new city that summer and slowly started figuring out what I actually wanted."

function ComposerArea({ large }: { large: boolean }) {
  const [charCount, setCharCount] = useState(0)
  const [helpOpen, setHelpOpen] = useState(false)
  const helpRef = useRef<HTMLSpanElement>(null)

  const closeHelp = useCallback((e: MouseEvent | TouchEvent) => {
    if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
      setHelpOpen(false)
    }
  }, [])

  useEffect(() => {
    if (helpOpen) {
      document.addEventListener('mousedown', closeHelp)
      document.addEventListener('touchstart', closeHelp)
      return () => {
        document.removeEventListener('mousedown', closeHelp)
        document.removeEventListener('touchstart', closeHelp)
      }
    }
  }, [helpOpen, closeHelp])

  return (
    <ThreadPrimitive.If running={false}>
      <ComposerPrimitive.Root className={`chatbot__composer${large ? ' chatbot__composer--large' : ''}`}>
        <div className="chatbot__input-wrapper">
          <ComposerPrimitive.Input
            placeholder="Type your response..."
            className="chatbot__input"
            rows={large ? 4 : 1}
            maxLength={large ? MAX_ELABORATION_CHARS : undefined}
            autoFocus
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (large) setCharCount(e.target.value.length)
            }}
          />
          {large && (
            <>
              <span className="chatbot__char-count">
                {charCount}/{MAX_ELABORATION_CHARS}
              </span>
              <div className="chatbot__composer-help">
                <span
                  className={`chatbot__options-tooltip${helpOpen ? ' chatbot__options-tooltip--open' : ''}`}
                  ref={helpRef}
                >
                  <span
                    className="chatbot__options-tooltip-icon"
                    onClick={() => setHelpOpen(!helpOpen)}
                  >
                    Help
                  </span>
                  <span className="chatbot__options-tooltip-text chatbot__options-tooltip-text--above">
                    <span className="chatbot__options-tooltip-row">
                      <strong>Example:</strong> {ELABORATION_EXAMPLE}
                    </span>
                  </span>
                </span>
              </div>
            </>
          )}
        </div>
        <ComposerPrimitive.Send className="chatbot__send-btn">
          Send
        </ComposerPrimitive.Send>
      </ComposerPrimitive.Root>
    </ThreadPrimitive.If>
  )
}
