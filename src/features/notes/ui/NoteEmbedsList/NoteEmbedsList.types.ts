import type { NoteListItem } from '../../model/types';

export interface NoteEmbedsListProps {
  embeds: NoteListItem[];
  onNavigate: (id: string) => void;
}
