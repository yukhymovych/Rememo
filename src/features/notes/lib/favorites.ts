import type { NoteListItem } from '../model/types';

/**
 * Returns favorite notes in deterministic order.
 * Using sort_order avoids timestamp-driven reordering while navigating notes.
 */
export function getFavoriteNotes(notes: NoteListItem[] | undefined): NoteListItem[] {
  if (!notes) return [];

  return notes
    .filter((note) => note.is_favorite)
    .sort((a, b) => {
      const sortA = a.sort_order ?? 0;
      const sortB = b.sort_order ?? 0;
      if (sortA !== sortB) return sortA - sortB;
      return a.id.localeCompare(b.id);
    });
}
