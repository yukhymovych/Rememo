import { Clock } from 'lucide-react';
import { Button } from '@/shared/ui';
import { formatDate } from '../../domain/formatDate';
import { NotesListItem } from '../NotesListItem';
import type { NotesListPageProps } from './NotesListPage.types';
import './NotesListPage.css';

export function NotesListPageView({
  notes,
  recentNotes,
  recentFormattedTimes,
  isLoading,
  error,
  createError,
  createPending,
  onNewNote,
  onNoteClick,
}: NotesListPageProps) {
  if (isLoading) {
    return <div className="notes-list-page__container">Loading notes...</div>;
  }

  if (error) {
    return (
      <div className="notes-list-page__container notes-list-page__container--error">
        Error loading notes: {error.message}
      </div>
    );
  }

  return (
    <div className="notes-list-page__container">
      <div className="notes-list-page__toolbar">
        <div className="notes-list-page__toolbar-actions">
          <Button
            variant="primary"
            onClick={onNewNote}
            disabled={createPending}
          >
            {createPending ? 'Creating...' : 'New note'}
          </Button>
        </div>
      </div>

      {createError && (
        <div className="notes-list-page__create-error">Error: {createError.message}</div>
      )}

      {recentNotes.length > 0 && (
        <section className="notes-list-page__recents">
          <h2 className="notes-list-page__recents-title">
            <Clock className="notes-list-page__recents-icon size-4" />
            Recently visited
          </h2>
          <ul className="notes-list-page__list">
            {recentNotes.map((note) => (
              <NotesListItem
                key={note.id}
                note={note}
                formattedDate={recentFormattedTimes.get(note.id) ?? ''}
                onClick={() => onNoteClick(note.id)}
              />
            ))}
          </ul>
        </section>
      )}

      <div>
        {!notes || notes.length === 0 ? (
          <p>No notes yet. Click &quot;New note&quot; to create one.</p>
        ) : (
          <>
            {notes.filter((n) => !recentNotes.some((r) => r.id === n.id)).length > 0 && (
              <h2 className="notes-list-page__section-title">All notes</h2>
            )}
            <ul className="notes-list-page__list">
            {notes
              .filter((note) => !recentNotes.some((r) => r.id === note.id))
              .map((note) => (
                <NotesListItem
                  key={note.id}
                  note={note}
                  formattedDate={formatDate(note.updated_at)}
                  onClick={() => onNoteClick(note.id)}
                />
              ))}
          </ul>
          </>
        )}
      </div>
    </div>
  );
}
