import type { NoteListItem } from '../../model/types';

export interface NotesListPageProps {
  notes: NoteListItem[] | undefined;
  recentNotes: NoteListItem[];
  recentFormattedTimes: Map<string, string>;
  isLoading: boolean;
  error: Error | null;
  createError: Error | null;
  createPending: boolean;
  onNewNote: () => void;
  onNoteClick: (noteId: string) => void;
}
