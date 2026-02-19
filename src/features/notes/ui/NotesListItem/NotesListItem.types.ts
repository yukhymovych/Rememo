import type { NoteListItem } from '../../model/types';

export interface NotesListItemProps {
  note: NoteListItem;
  formattedDate: string;
  onClick: () => void;
}
