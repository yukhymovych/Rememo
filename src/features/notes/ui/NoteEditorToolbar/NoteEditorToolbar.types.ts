import type { NoteListItem } from '../../model/types';
import type { SaveStatus } from '../../model/useNoteEditor';

export interface NoteEditorToolbarProps {
  activeId: string;
  notes: NoteListItem[] | undefined;
  currentTitle: string;
  saveStatus: SaveStatus;
  onDelete: () => void;
  isDeleting: boolean;
}
