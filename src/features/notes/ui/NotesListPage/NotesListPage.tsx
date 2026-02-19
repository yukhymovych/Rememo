import { Button } from '@/shared/ui';
import { formatDate } from '../../domain/formatDate';
import { NotesListItem } from '../NotesListItem';
import type { NotesListPageProps } from './NotesListPage.types';
import './NotesListPage.css';

export function NotesListPageView({
  notes,
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
      <h1 className="notes-list-page__header">Notes</h1>
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

      <div>
        {!notes || notes.length === 0 ? (
          <p>No notes yet. Click &quot;New note&quot; to create one.</p>
        ) : (
          <ul className="notes-list-page__list">
            {notes.map((note) => (
              <NotesListItem
                key={note.id}
                note={note}
                formattedDate={formatDate(note.updated_at)}
                onClick={() => onNoteClick(note.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
