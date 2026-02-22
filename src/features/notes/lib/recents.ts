import type { NoteListItem } from '../model/types';

/**
 * Returns last 10 visited notes, ordered from earliest to latest by last_visited_at.
 * Pure function - no side effects.
 */
export function getRecentNotes(notes: NoteListItem[] | undefined): NoteListItem[] {
  if (!notes) return [];
  return notes
    .filter((n) => n.last_visited_at)
    .sort(
      (a, b) =>
        new Date(a.last_visited_at!).getTime() -
        new Date(b.last_visited_at!).getTime()
    )
    .slice(-10);
}
