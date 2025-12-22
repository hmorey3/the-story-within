import type { ReactNode } from 'react';
import './CircularBeatGrid.css';
import type { StoryBeat } from '../types/story';

// TODO: delete this and dependencies

interface CircularBeatGridProps {
  beats: StoryBeat[];
  renderBeat: (beat: StoryBeat) => ReactNode;
}

const ROW_PATTERN = [2, 3, 4, 3, 2];

export function CircularBeatGrid({ beats, renderBeat }: CircularBeatGridProps) {
  const rows = buildRows(beats);
  const hasExpandedMiddle = rows[2]?.length > ROW_PATTERN[2];

  return (
    <div className="circular-grid">
      <div className="circular-grid__scroll">
        <div className="circular-grid__rows">
          {rows.map((row, rowIndex) => {
            if (!row || row.length === 0) return null;
            const isMiddle = rowIndex === 2;
            const rowClasses = [
              'circular-grid__row',
              `circular-grid__row--${rowIndex + 1}`,
              isMiddle && hasExpandedMiddle ? 'circular-grid__row--expanded' : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div key={`grid-row-${rowIndex}`} className={rowClasses}>
                {row.map((beat) => (
                  <div key={beat.id} className="circular-grid__cell">
                    {renderBeat(beat)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function buildRows(beats: StoryBeat[]) {
  const remaining = [...beats];
  const rows = ROW_PATTERN.map((capacity) => remaining.splice(0, capacity));
  if (remaining.length > 0) {
    rows[2].push(...remaining);
  }
  return rows;
}
