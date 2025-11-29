import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoriesProvider } from './state/StoriesContext';
import { StoryPage } from './pages/StoryPage';
import { StoryCoverPage } from './pages/StoryCoverPage';
import { StoryBeatEditorPage } from './pages/StoryBeatEditorPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { HomePage } from './pages/Home';
import './styles/theme.css';
// import './styles/theme-vintage.css';
import './index.css';
import { LibraryPageBookshelf } from './pages/LibraryPageBookshelf';

export function App() {
  const basename = import.meta.env.BASE_URL ?? '/';

  return (<>
    <StoriesProvider>
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPageBookshelf />} />
          <Route path="/stories/:storyId" element={<StoryPage />} />
          <Route path="/stories/:storyId/cover" element={<StoryCoverPage />} />
          <Route path="/stories/:storyId/beats/:beatId" element={<StoryBeatEditorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </StoriesProvider>
  </>);
}
