import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/shared/ui';
import {
  useStudyItemStatus,
  useActivateLearningPage,
  useActivateLearningPageScoped,
  useDeactivateLearningPage,
} from '@/features/learning/model';
import type { NotePageActionsMenuProps } from './NotePageActionsMenu.types';

export function NotePageActionsMenu({
  noteId,
  isFavorite,
  hasChildren = false,
  onAddToFavorites,
  onRemoveFromFavorites,
  onCreateChild,
  onDelete,
  isDeleting,
}: NotePageActionsMenuProps) {
  const { data: studyStatus } = useStudyItemStatus(noteId);
  const activateLearning = useActivateLearningPage();
  const activateLearningScoped = useActivateLearningPageScoped();
  const deactivateLearning = useDeactivateLearningPage();

  const isLearningActive = studyStatus?.status === 'active';

  const handleSetAsLearning = () => {
    activateLearning.mutate(noteId);
  };

  const handleSetAsLearningScoped = () => {
    activateLearningScoped.mutate(noteId);
  };

  const handleRemoveFromLearning = () => {
    deactivateLearning.mutate(noteId);
  };

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
      {isLearningActive ? (
        <DropdownMenuItem onClick={handleRemoveFromLearning}>
          Remove from learning
        </DropdownMenuItem>
      ) : (
        hasChildren ? (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Set as learning page</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={handleSetAsLearning}>
                Add this page only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSetAsLearningScoped}>
                Add this page and descendants
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ) : (
          <DropdownMenuItem onClick={handleSetAsLearning}>
            Set as learning page
          </DropdownMenuItem>
        )
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
