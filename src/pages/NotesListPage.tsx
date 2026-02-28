import { useNotesListPage } from '../features/notes/model/useNotesListPage';
import { NotesListPageView } from '../features/notes/ui/NotesListPage';

export function NotesListPage() {
  const {
    notes,
    recentNotes,
    favoriteNotes,
    recentFormattedTimes,
    favoriteFormattedTimes,
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
      favoriteNotes={favoriteNotes}
      recentFormattedTimes={recentFormattedTimes}
      favoriteFormattedTimes={favoriteFormattedTimes}
      isLoading={isLoading}
      error={error}
      createError={createMutation.error}
      createPending={createMutation.isPending}
      onNewNote={handleNewNote}
      onNoteClick={handleNoteClick}
    />
  );
}
