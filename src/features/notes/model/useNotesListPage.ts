import { useNavigate } from 'react-router-dom';
import { useNotesQuery, useCreateNote } from './useNotes';
import { notesRoutes } from '../lib/routes';

export function useNotesListPage() {
  const navigate = useNavigate();
  const { data: notes, isLoading, error } = useNotesQuery();
  const createMutation = useCreateNote();

  const handleNewNote = async () => {
    const note = await createMutation.mutateAsync({});
    navigate(notesRoutes.editor(note.id));
  };

  const handleNoteClick = (noteId: string) => {
    navigate(notesRoutes.editor(noteId));
  };

  return {
    notes,
    isLoading,
    error,
    createMutation,
    handleNewNote,
    handleNoteClick,
  };
}
