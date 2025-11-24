interface DetailEditorFooterProps {
  canGoPrev: boolean;
  canGoNext: boolean;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function DetailEditorFooter({ canGoPrev, canGoNext, onNavigate }: DetailEditorFooterProps) {
  return (
    <footer className="beat-card__footer">
      <button type="button" className="beat-card__nav" onClick={() => onNavigate('prev')} disabled={!canGoPrev}>
        ← Previous
      </button>
      <button type="button" className="beat-card__nav" onClick={() => onNavigate('next')} disabled={!canGoNext}>
        Next →
      </button>
    </footer>
  );
}
