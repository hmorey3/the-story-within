import type { ReactNode } from 'react';

interface DetailEditorSidebarProps {
  children: ReactNode;
}

export function DetailEditorSidebar({ children }: DetailEditorSidebarProps) {
  return <aside className="editor-view__library beat-library-panel">{children}</aside>;
}
