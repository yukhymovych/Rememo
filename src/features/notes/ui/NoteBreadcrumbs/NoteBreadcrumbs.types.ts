import type { NoteListItem } from '../../model/types';

export interface BreadcrumbEllipsisDropdownProps {
  ancestorIds: string[];
  titleById: Map<string, string>;
  onNavigate: (id: string) => void;
}

export interface BreadcrumbAncestorLinkProps {
  id: string;
  title: string;
}

export interface NoteBreadcrumbsProps {
  activeId: string;
  notes: NoteListItem[] | undefined;
  currentTitle: string;
}
