interface DetailEditorVisualPanelProps {
  imageUrl?: string;
  placeholder?: string;
}

export function DetailEditorVisualPanel({
  imageUrl,
  placeholder = 'Pick a beat to add imagery',
}: DetailEditorVisualPanelProps) {
  const hasImage = Boolean(imageUrl);
  return (
    <figure
      className={`beat-card__visual ${hasImage ? '' : 'is-empty'}`}
      style={hasImage ? { backgroundImage: `url(${imageUrl})` } : undefined}
    >
      {!hasImage && <span className="beat-card__image-placeholder">{placeholder}</span>}
    </figure>
  );
}
