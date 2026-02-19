import { useNotesListPage } from '../features/notes/model/useNotesListPage';
import { NotesListPageView } from '../features/notes/ui/NotesListPage';

export function NotesListPage() {
  const {
    notes,
    isLoading,
    error,
    createMutation,
    handleNewNote,
    handleNoteClick,
  } = useNotesListPage();

  return (
    <NotesListPageView
      notes={notes}
      isLoading={isLoading}
      error={error}
      createError={createMutation.error}
      createPending={createMutation.isPending}
      onNewNote={handleNewNote}
      onNoteClick={handleNoteClick}
    />
  );
}
