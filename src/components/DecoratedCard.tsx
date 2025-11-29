import type { PropsWithChildren, ReactElement } from 'react';
import './DecoratedCard.css';

interface DecoratedCardProps {
  className?: string;
  bodyClassName?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function DecoratedCard({
  children,
  className,
  bodyClassName,
  as: Tag = 'section',
}: PropsWithChildren<DecoratedCardProps>): ReactElement {
  const containerClass = ['decorated-card', className].filter(Boolean).join(' ');
  const bodyClass = ['decorated-card__body', bodyClassName].filter(Boolean).join(' ');

  return (
    <Tag className={containerClass}>
      <div className={bodyClass}>{children}</div>
    </Tag>
  );
}
