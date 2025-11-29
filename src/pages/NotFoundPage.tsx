import { useNavigate } from 'react-router-dom';

interface NotFoundPageProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function NotFoundPage({ message = 'Screen not found.', actionLabel = 'Return to library', onAction }: NotFoundPageProps) {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    navigate('/library');
  };

  return (
    <main className="page">
      <p>{message}</p>
      <button type="button" onClick={handleAction}>
        {actionLabel}
      </button>
    </main>
  );
}
