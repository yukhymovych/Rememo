import { Clock, Star } from 'lucide-react';
import { Button } from '@/shared/ui';
import { formatDate } from '../../domain/formatDate';
import { NotesListItem } from '../NotesListItem';
import { NotesSliderSection } from '../NotesSliderSection';
import type { NotesListPageProps } from './NotesListPage.types';
import './NotesListPage.css';

export function NotesListPageView({
  notes,
  recentNotes,
  favoriteNotes,
  recentFormattedTimes,
  favoriteFormattedTimes,
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

      <div className="notes-list-page__middle">
        <NotesSliderSection
          title="Recently visited"
          icon={Clock}
          notes={recentNotes}
          formattedTimes={recentFormattedTimes}
          onNoteClick={onNoteClick}
        />
        <NotesSliderSection
          title="Favorites"
          icon={Star}
          notes={favoriteNotes}
          formattedTimes={favoriteFormattedTimes}
          onNoteClick={onNoteClick}
        />
      </div>

      <div>
        {!notes || notes.length === 0 && (
          <p>No notes yet. Click &quot;New note&quot; to create one.</p>
        )}
      </div>
    </div>
  );
}
