import { useEffect, useState } from 'react'
import LibraryPage from './pages/LibraryPage'
import StoryBeatsCarousel from './pages/StoryBeatsCarousel'
import ChatbotWidget from './chatbot/ChatbotWidget'

const getStoryId = (path: string) => {
  if (!path.startsWith('/story-beats/')) {
    return null
  }

  const id = path.replace('/story-beats/', '')
  return id ? decodeURIComponent(id) : null
}

function AppRouter() {
  const [pathname, setPathname] = useState(
    window.location.pathname || '/',
  )

  const navigate = (path: string) => {
    if (path === pathname) {
      return
    }

    window.history.pushState({}, '', path)
    setPathname(path)
  }

  useEffect(() => {
    const handlePopState = () =>
      setPathname(window.location.pathname || '/')
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const storyId = getStoryId(pathname)
  if (storyId) {
    return (
      <>
        <StoryBeatsCarousel storyId={storyId} onClose={() => navigate('/')} />
        <ChatbotWidget
          onOpenStoryBeats={(storyId) =>
            navigate(`/story-beats/${encodeURIComponent(storyId)}`)
          }
        />
      </>
    )
  }

  return (
    <>
      <LibraryPage
        onOpenStoryBeats={(storyId) =>
          navigate(`/story-beats/${encodeURIComponent(storyId)}`)
        }
      />
      <ChatbotWidget
        onOpenStoryBeats={(storyId) =>
          navigate(`/story-beats/${encodeURIComponent(storyId)}`)
        }
      />
    </>
  )
}

export default AppRouter
