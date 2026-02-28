import type { LucideIcon } from 'lucide-react';
import type { NoteListItem } from '../../model/types';

export interface NotesSliderSectionProps {
  title: string;
  icon: LucideIcon;
  notes: NoteListItem[];
  formattedTimes: Map<string, string>;
  onNoteClick: (noteId: string) => void;
}
