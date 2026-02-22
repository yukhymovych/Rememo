import { useNotesListPage } from '../features/notes/model/useNotesListPage';
import { NotesListPageView } from '../features/notes/ui/NotesListPage';

export function NotesListPage() {
  const {
    notes,
    recentNotes,
    recentFormattedTimes,
    isLoading,
    error,
    createMutation,
    handleNewNote,
    handleNoteClick,
  } = useNotesListPage();

  return (
    <NotesListPageView
      notes={notes}
      recentNotes={recentNotes}
      recentFormattedTimes={recentFormattedTimes}
      isLoading={isLoading}
      error={error}
      createError={createMutation.error}
      createPending={createMutation.isPending}
      onNewNote={handleNewNote}
      onNoteClick={handleNoteClick}
    />
  );
}
