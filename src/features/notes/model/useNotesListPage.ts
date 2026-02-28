import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotesQuery, useCreateNote } from './useNotes';
import { notesRoutes } from '../lib/routes';
import { formatRelativeTime } from '../domain/formatDate';
import { getRecentNotes } from '../lib/recents';
import { getFavoriteNotes } from '../lib/favorites';

export function useNotesListPage() {
  const navigate = useNavigate();
  const { data: notes, isLoading, error } = useNotesQuery();
  const createMutation = useCreateNote();

  const recentNotes = useMemo(() => getRecentNotes(notes), [notes]);
  const favoriteNotes = useMemo(() => getFavoriteNotes(notes), [notes]);

  const recentFormattedTimes = useMemo(() => {
    const map = new Map<string, string>();
    recentNotes.forEach((n) => {
      if (n.last_visited_at) {
        map.set(n.id, formatRelativeTime(n.last_visited_at));
      }
    });
    return map;
  }, [recentNotes]);

  const favoriteFormattedTimes = useMemo(() => {
    const map = new Map<string, string>();
    favoriteNotes.forEach((n) => {
      if (n.last_visited_at) {
        map.set(n.id, formatRelativeTime(n.last_visited_at));
      }
    });
    return map;
  }, [favoriteNotes]);

  const handleNewNote = async () => {
    const note = await createMutation.mutateAsync({});
    navigate(notesRoutes.editor(note.id));
  };

  const handleNoteClick = (noteId: string) => {
    navigate(notesRoutes.editor(noteId));
  };

  return {
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
  };
}
