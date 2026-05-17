import { AssistantRuntimeProvider } from '@assistant-ui/react'
import { useStoryRuntime } from '../chatbot/useStoryRuntime'
import { ChatbotPanel } from '../chatbot/ChatbotPanel'
import './ChatbotWidget.css'

type ChatbotWidgetProps = {
  isOpen: boolean
  onClose: () => void
  onOpenStoryBeats: (bookId: string) => void
}

type ChatSessionProps = {
  onComplete: (bookId: string) => void
  onClose: () => void
}

function ChatSession({ onComplete, onClose }: ChatSessionProps) {
  const { runtime, dimensionIndex, showOptions, showPronounOptions, showComposer, composerLarge, showSkipElaboration, onChoice, skipElaboration } =
    useStoryRuntime({ onComplete })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <div className="chatbot__panel" role="dialog" aria-label="Story chatbot">
        <button
          className="chatbot__close"
          type="button"
          onClick={onClose}
          aria-label="Close chatbot"
        >
          ×
        </button>
        <ChatbotPanel
          dimensionIndex={dimensionIndex}
          showOptions={showOptions}
          showPronounOptions={showPronounOptions}
          showComposer={showComposer}
          composerLarge={composerLarge}
          showSkipElaboration={showSkipElaboration}
          onChoice={onChoice}
          onSkipElaboration={skipElaboration}
        />
      </div>
    </AssistantRuntimeProvider>
  )
}

function ChatbotWidget({ isOpen, onClose, onOpenStoryBeats }: ChatbotWidgetProps) {
  if (!isOpen) return null

  return (
    <ChatSession
      onComplete={(bookId) => {
        onOpenStoryBeats(bookId)
        onClose()
      }}
      onClose={onClose}
    />
  )
}

export default ChatbotWidget
