export interface NotePageActionsMenuProps {
  noteId: string;
  isFavorite: boolean;
  onAddToFavorites?: (noteId: string) => void;
  onRemoveFromFavorites?: (noteId: string) => void;
  onCreateChild: (parentId: string) => void;
  onDelete: (noteId: string) => void;
  isDeleting: boolean;
}
