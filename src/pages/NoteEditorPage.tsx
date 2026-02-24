import { useParams } from 'react-router-dom';
import { useNoteEditor } from '../features/notes/model/useNoteEditor';
import { DEFAULT_NOTE_TITLE } from '../features/notes/model/types';
import { NoteEditorToolbar } from '../features/notes/ui/NoteEditorToolbar';
import { NoteTitleInput } from '../features/notes/ui/NoteTitleInput';
import { NoteEditorBody } from '../features/notes/ui/NoteEditorBody';
import { NoteEditorLearningGradeBar } from '../features/learning/ui/NoteEditorLearningGradeBar';

const contentStyles = {
  padding: '20px',
  maxWidth: 800,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box' as const,
};

export function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const {
    note,
    isLoading,
    error,
    notes,
    editor,
    title,
    handleTitleChange,
    saveStatus,
    handleDelete,
    handleAddToFavorites,
    handleRemoveFromFavorites,
    handleCreateChild,
    isDeleting,
    isFavorite,
    noteTitlesMap,
    getSlashMenuItems,
  } = useNoteEditor(id);

  if (isLoading || !id) {
    return <div style={contentStyles}>Loading note...</div>;
  }

  if (error || !note) {
    return (
      <div style={{ ...contentStyles, color: 'red' }}>
        Error: {error?.message ?? 'Note not found'}
      </div>
    );
  }

  return (
    <div style={contentStyles}>
      <NoteEditorToolbar
        activeId={id}
        notes={notes}
        currentTitle={title.trim() || note.title || DEFAULT_NOTE_TITLE}
        saveStatus={saveStatus}
        isFavorite={isFavorite}
        onAddToFavorites={handleAddToFavorites}
        onRemoveFromFavorites={handleRemoveFromFavorites}
        onCreateChild={handleCreateChild}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
      <NoteTitleInput value={title} onChange={handleTitleChange} />
      <NoteEditorBody
        editor={editor}
        noteTitlesMap={noteTitlesMap}
        getSlashMenuItems={getSlashMenuItems}
      />
      <NoteEditorLearningGradeBar noteId={id} />
    </div>
  );
}
