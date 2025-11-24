import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { StoriesProvider } from './state/StoriesContext';
import { LibraryPage } from './pages/LibraryPage';
import { StoryPage } from './pages/StoryPage';
import { StoryCoverPage } from './pages/StoryCoverPage';
import { StoryBeatEditorPage } from './pages/StoryBeatEditorPage';
import { NotFoundPage } from './pages/NotFoundPage';

export function App() {
  return (
    <StoriesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/stories/:storyId" element={<StoryPage />} />
          <Route path="/stories/:storyId/cover" element={<StoryCoverPage />} />
          <Route path="/stories/:storyId/beats/:beatId" element={<StoryBeatEditorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </StoriesProvider>
  );
}
