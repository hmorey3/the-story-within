import { useEffect, useRef, useState } from 'react'
import { storyBeatCategories } from '../data/beatCategories'
import { formatPromptLabel } from '../services/chatbotPrompts'
import { useChatbotSession } from '../hooks/useChatbotSession'
import './ChatbotWidget.css'

type ChatbotWidgetProps = {
  onOpenStoryBeats: (bookId: string) => void
}

function ChatbotWidget({ onOpenStoryBeats }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const {
    inputValue,
    setInputValue,
    messages,
    pendingResponse,
    promptSuggestionsForUser,
    progress,
    submitMessage,
  } = useChatbotSession({
    isOpen,
    onComplete: (bookId) => {
      onOpenStoryBeats(bookId)
      setIsOpen(false)
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen, messages])

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <div className={`chatbot ${isOpen ? 'chatbot--open' : ''}`}>
      <button
        className="chatbot__toggle"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Close story chatbot' : 'Open story chatbot'}
      >
        <span aria-hidden="true">✦</span>
      </button>
      {isOpen && (
        <div className="chatbot__panel" role="dialog" aria-label="Story chatbot">
          <header className="chatbot__header">
            <div>
              <p className="chatbot__title">Story Guide</p>
              <p className="chatbot__subtitle">
                {progress.length}/{storyBeatCategories.length} beats gathered
              </p>
            </div>
            <button
              className="chatbot__close"
              type="button"
              onClick={handleClose}
              aria-label="Close chatbot"
            >
              ×
            </button>
          </header>
          <div className="chatbot__messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chatbot__message chatbot__message--${message.role}`}
              >
                <p>{message.content}</p>
              </div>
            ))}
            {pendingResponse && (
              <div className="chatbot__message chatbot__message--assistant">
                <p>Typing…</p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {promptSuggestionsForUser.length > 0 && (
            <div className="chatbot__pills" aria-label="Suggested prompts">
              {promptSuggestionsForUser.map((suggestion, index) => (
                <button
                  key={`${suggestion.label}-${suggestion.mode}-${index}`}
                  type="button"
                  className="chatbot__pill"
                  onClick={() => {
                    if (suggestion.mode === 'answer') {
                      submitMessage(suggestion.label)
                      return
                    }

                    // Strip trailing ellipsis/dots so user can type immediately
                    const nextValue = suggestion.label.trim().replace(/\.{2,}$|…$/g, '')
                    setInputValue(nextValue ? `${nextValue} ` : '')
                    inputRef.current?.focus()
                  }}
                >
                  {formatPromptLabel(suggestion)}
                </button>
              ))}
            </div>
          )}
          <div className="chatbot__input-row">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Type your response..."
              disabled={pendingResponse}
              aria-label="Chat input"
              ref={inputRef}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  submitMessage()
                }
              }}
            />
            <button
              type="button"
              onClick={() => submitMessage()}
              disabled={pendingResponse || !inputValue.trim()}
              aria-label="Send message"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatbotWidget
