import {
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/ui';
import type { NotePageActionsMenuProps } from './NotePageActionsMenu.types';

export function NotePageActionsMenu({
  noteId,
  isFavorite,
  onAddToFavorites,
  onRemoveFromFavorites,
  onCreateChild,
  onDelete,
  isDeleting,
}: NotePageActionsMenuProps) {
  return (
    <DropdownMenuContent align="end">
      {isFavorite ? (
        <DropdownMenuItem onClick={() => onRemoveFromFavorites?.(noteId)}>
          Remove from Favorites
        </DropdownMenuItem>
      ) : (
        <DropdownMenuItem onClick={() => onAddToFavorites?.(noteId)}>
          Add to Favorites
        </DropdownMenuItem>
      )}
      <DropdownMenuItem onClick={() => onCreateChild(noteId)}>
        Add new page
      </DropdownMenuItem>
      <DropdownMenuItem
        variant="destructive"
        onClick={() => onDelete(noteId)}
        disabled={isDeleting}
      >
        Delete page
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
